use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult, CanonicalAddr, Addr,
};

use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, PasswordResponse, WhiteListResponse, BlockTimeResponse};
use crate::state::{config, config_read, State};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {

    let state = State {
        password: msg.password,
        whitelist: msg.whitelist.iter().map(|x| deps.api.addr_canonicalize(&x.to_string())).collect::<StdResult<Vec<_>>>()?,
        elapsed_blocks: msg.elapsed_blocks,
        creation_height: _env.block.height,
        owner: info.sender.clone(),
    };

    deps.api
        .debug(format!("Contract was initialized by {}", info.sender).as_str());
    config(deps.storage).save(&state)?;

    Ok(Response::default())
}

#[entry_point]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
    match msg {
        ExecuteMsg::SetPassword { password } => try_set_password(deps, info, env, password),
        // ExecuteMsg::AddWhiteList { guest } => try_add_whitelist(deps, guest),
        // ExecuteMsg::RemoveWhiteList { guest } => try_remove_whitelist(deps, guest),
        ExecuteMsg::ResetWhiteList { whitelist } => try_reset_whitelist(deps, info, whitelist),
        ExecuteMsg::SetElapsedBlockTime { elapsed_blocks } => try_set_elapsed_time(deps, info, elapsed_blocks),
        ExecuteMsg::GetPassword {} => try_get_password(deps, env, info),
    }
}

pub fn try_set_password(deps: DepsMut, info: MessageInfo, env: Env, password: String) -> StdResult<Response> {
    let sender_address = info.sender.clone();

    config(deps.storage).update(|mut state| -> Result<_, StdError> {
        if sender_address != state.owner {
            return Err(StdError::generic_err("Only the owner can set the password!"));
        }
        state.password = password;
        state.creation_height = env.block.height;
        Ok(state)
    })?;

    deps.api.debug("password saved successfully!");
    Ok(Response::default())
}

pub fn try_reset_whitelist(deps: DepsMut, info: MessageInfo, whitelist: Vec<Addr>) -> StdResult<Response> {
    let sender_address = info.sender.clone();

    config(deps.storage).update(|mut state| -> Result<_, StdError> {
        if sender_address != state.owner {
            return Err(StdError::generic_err("Only the owner can reset the whitelist!!"));
        }
        state.whitelist = whitelist.iter().map(|x| deps.api.addr_canonicalize(&x.to_string())).collect::<StdResult<Vec<_>>>()?;
        Ok(state)
    })?;

    deps.api.debug("whitelist reset correctly!!");
    Ok(Response::default())
}

pub fn try_set_elapsed_time(deps: DepsMut, info: MessageInfo, elapsed_blocks: u64) -> StdResult<Response> {
    let sender_address = info.sender.clone();

    config(deps.storage).update(|mut state| -> Result<_, StdError> {
        if sender_address != state.owner {
            return Err(StdError::generic_err("Only the owner can set the elapsed blocks!!!"))
        }
        state.elapsed_blocks = elapsed_blocks;
        Ok(state)
    })?;

    deps.api.debug("elapsed blocks set successfully!!!");
    Ok(Response::default())
}

fn try_get_password(deps: DepsMut, env: Env, info: MessageInfo) -> StdResult<Response> {
    let state = config_read(deps.storage).load()?;
    let sender_address = info.sender.clone();

    if !state.whitelist.contains(&deps.api.addr_canonicalize(&sender_address.to_string())?) {
        return Err(StdError::generic_err("Unauthorized user!"));
    }

    if env.block.height < state.creation_height + state.elapsed_blocks {
        return Err(StdError::generic_err("Time not elapsed yet"));
    }

    deps.api.debug("get_password successfully!!!");
    let password = state.password.clone();
    Ok(Response::new().add_attribute("password", password))
}


#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetElapsedBlockTime {} => to_binary(&query_elapsed_block_time(deps)?),
        QueryMsg::GetWhiteList {} => to_binary(&query_whitelist(deps)?),
    }
}

fn query_elapsed_block_time(deps:Deps) -> StdResult<BlockTimeResponse> {
    let state = config_read(deps.storage).load()?;

    Ok(BlockTimeResponse { elapsed_blocks: state.elapsed_blocks })
}


fn query_whitelist(deps: Deps ) -> StdResult<WhiteListResponse> {
    let state = config_read(deps.storage).load()?;

    let whitelist = state.whitelist.iter().map(|x| deps.api.addr_humanize(&x)).collect::<StdResult<Vec<_>>>()?;
    Ok(WhiteListResponse { whitelist: whitelist })
}

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use cosmwasm_std::testing::*;
//     use cosmwasm_std::{from_binary, Coin, StdError, Uint128};

//     #[test]
//     fn proper_initialization() {
//         let mut deps = mock_dependencies();
//         let info = mock_info(
//             "creator",
//             &[Coin {
//                 denom: "earth".to_string(),
//                 amount: Uint128::new(1000),
//             }],
//         );
//         let init_msg = InstantiateMsg { count: 17 };

//         // we can just call .unwrap() to assert this was a success
//         let res = instantiate(deps.as_mut(), mock_env(), info, init_msg).unwrap();

//         assert_eq!(0, res.messages.len());

//         // it worked, let's query the state
//         let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
//         let value: CountResponse = from_binary(&res).unwrap();
//         assert_eq!(17, value.count);
//     }

//     #[test]
//     fn increment() {
//         let mut deps = mock_dependencies_with_balance(&[Coin {
//             denom: "token".to_string(),
//             amount: Uint128::new(2),
//         }]);
//         let info = mock_info(
//             "creator",
//             &[Coin {
//                 denom: "token".to_string(),
//                 amount: Uint128::new(2),
//             }],
//         );
//         let init_msg = InstantiateMsg { count: 17 };

//         let _res = instantiate(deps.as_mut(), mock_env(), info, init_msg).unwrap();

//         // anyone can increment
//         let info = mock_info(
//             "anyone",
//             &[Coin {
//                 denom: "token".to_string(),
//                 amount: Uint128::new(2),
//             }],
//         );

//         let exec_msg = ExecuteMsg::Increment {};
//         let _res = execute(deps.as_mut(), mock_env(), info, exec_msg).unwrap();

//         // should increase counter by 1
//         let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
//         let value: CountResponse = from_binary(&res).unwrap();
//         assert_eq!(18, value.count);
//     }

//     #[test]
//     fn reset() {
//         let mut deps = mock_dependencies_with_balance(&[Coin {
//             denom: "token".to_string(),
//             amount: Uint128::new(2),
//         }]);
//         let info = mock_info(
//             "creator",
//             &[Coin {
//                 denom: "token".to_string(),
//                 amount: Uint128::new(2),
//             }],
//         );
//         let init_msg = InstantiateMsg { count: 17 };

//         let _res = instantiate(deps.as_mut(), mock_env(), info, init_msg).unwrap();

//         // not anyone can reset
//         let info = mock_info(
//             "anyone",
//             &[Coin {
//                 denom: "token".to_string(),
//                 amount: Uint128::new(2),
//             }],
//         );
//         let exec_msg = ExecuteMsg::Reset { count: 5 };

//         let res = execute(deps.as_mut(), mock_env(), info, exec_msg);

//         match res {
//             Err(StdError::GenericErr { .. }) => {}
//             _ => panic!("Must return unauthorized error"),
//         }

//         // only the original creator can reset the counter
//         let info = mock_info(
//             "creator",
//             &[Coin {
//                 denom: "token".to_string(),
//                 amount: Uint128::new(2),
//             }],
//         );
//         let exec_msg = ExecuteMsg::Reset { count: 5 };

//         let _res = execute(deps.as_mut(), mock_env(), info, exec_msg).unwrap();

//         // should now be 5
//         let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
//         let value: CountResponse = from_binary(&res).unwrap();
//         assert_eq!(5, value.count);
//     }
// }
