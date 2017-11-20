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
        key: 'type',
        index: 4,
        title: 'Place Type',
        renderer: 'placeType'
    },
    {
        key: 'policies',
        index: 5,
        title: 'Policies',
        renderer: 'subPlaceCounter',
    },
    {
        key: 'options',
        index: 6,
        title: '',
        renderer: 'subPlaceCounter',
    }
];
