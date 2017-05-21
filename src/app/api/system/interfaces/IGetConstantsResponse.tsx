interface IGetConstantsResponse {
    cache_lifetime: number;
    post_max_targets: number;
    post_max_attachments: number;
    post_retract_time: number;
    account_grandplaces_limit: number;
    place_max_level: number;
    place_max_children: number;
    place_max_creators: number;
    place_max_keyholders: number;
    attach_max_size: number;
    register_mode: number;
}

export default IGetConstantsResponse;
