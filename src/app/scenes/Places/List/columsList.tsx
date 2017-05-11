export interface IPlaceListColumn {
    key: string;
    title: string;
    renderer: string;
    index: number;
    icon ?: string;
}

export const columnsList: Array<IPlaceListColumn> = [
    {
        key: 'name',
        index: 0,
        title: 'Place Name',
        renderer: 'place',
    },
    {
        key: 'creators',
        index: 2,
        title: 'Managers',
        renderer: 'users',
    },
    {
        key: 'counters.counters',
        index: 3,
        title: 'Members',
        renderer: 'memberCounter',
        icon: 'member'
    },
    {
        key: 'sub-places',
        index: 4,
        title: 'Sub-places',
        renderer: 'subPlaceCounter',
    },
    {
        key: 'type',
        index: 5,
        title: 'Place Type',
        renderer: 'placeType'
    }
];
