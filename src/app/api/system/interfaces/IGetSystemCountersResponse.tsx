interface IGetSystemCountersResponse {
  disabled_accounts?: number;
  enabled_accounts?: number;
  grand_places?: number;
  locked_places?: number;
  unlocked_places?: number;
}

export default IGetSystemCountersResponse;
