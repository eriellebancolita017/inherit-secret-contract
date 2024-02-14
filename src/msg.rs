use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use secret_toolkit::permit::Permit;

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub password: String,
    pub elapsed_blocks: u64,
    pub whitelist: Vec<Addr>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    SetPassword { password: String },
    // AddWhiteList { guest: Addr },
    // RemoveWhiteList { guest: Addr },
    ResetWhiteList { whitelist: Vec<Addr> },
    SetElapsedBlockTime { elapsed_blocks: u64 },
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetElapsedBlockTime {},
    GetWhiteList {},
    GetPassword {permit: Permit},
}

// We define a custom struct for each query response
#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct PasswordResponse {
    pub password: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct WhiteListResponse {
    pub whitelist: Vec<Addr>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct BlockTimeResponse {
    pub elapsed_blocks: u64,
}


