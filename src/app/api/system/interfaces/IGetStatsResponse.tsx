interface IGetStatsResponse {
    gateway: IStat;
    msgapi: IStat;
    router: IStat;
    storage: IStat;
    userapi: IStat;
}
interface IStat {
    server_name: string;
    gc_cpu_fraction: number;
    gc_total_pause: number;
    go_routines: number;
    memory: IDetail;
}
interface IDetail {
    heap_alloc: string;
    heap_fragment: string;
    heap_idle: string;
    heap_objects: string;
    heap_released: string;
    heap_retained: string;
    objects_allocated: string;
    objects_freed: string;
    objects_live: string;
    sys: string;
    sys_heap: string;
    sys_stack: string;
}

export default IGetStatsResponse;
