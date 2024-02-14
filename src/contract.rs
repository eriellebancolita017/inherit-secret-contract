use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult, Addr,
};

use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, PasswordResponse, WhiteListResponse, BlockTimeResponse};
use crate::state::{config, config_read, State};
use crate::state::PREFIX_REVOKED_PERMITS;

use secret_toolkit::permit::validate;
use secret_toolkit::permit::Permit;

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

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetElapsedBlockTime {} => to_binary(&query_elapsed_block_time(deps)?),
        QueryMsg::GetWhiteList {} => to_binary(&query_whitelist(deps)?),
        QueryMsg::GetPassword { permit } => to_binary(&query_password(deps, _env, permit)?),
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

fn query_password(deps: Deps, env: Env, permit: Permit,) -> StdResult<PasswordResponse> {
    let state = config_read(deps.storage).load()?;
    let contract_address = env.contract.address;
    let viewer = validate(
        deps,
        PREFIX_REVOKED_PERMITS,
        &permit,
        contract_address.to_string(),
        None,
    );

    if !state.whitelist.contains(&deps.api.addr_canonicalize(deps.api.addr_validate(&viewer?.as_str())?.as_str())?) {
        return Err(StdError::generic_err("Unauthorized user!"));
    }

    if env.block.height < state.creation_height + state.elapsed_blocks {
        return Err(StdError::generic_err("Time not elapsed yet"));
    }

    deps.api.debug("get_password successfully!!!");
    let password = state.password.clone();
    Ok(PasswordResponse { password: password })
}
