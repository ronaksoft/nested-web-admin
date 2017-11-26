/**
 * @file component/SelectLevel/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description multi level selector
 *              Documented by:          robzizo
 *              Date of documentation:  2017-11-23
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import _ from 'lodash';
import {IcoN} from '../icon/index';
import {Row, Switch} from 'antd';
import ISelectLevel from './ISelectLevel';

interface ISelectLevelProps {
    items: Array<ISelectLevel>;
    onChangeLevel?: (level: string) => void;
    onChangeSearch?: (level: boolean) => void;
    index?: string;
}

interface ISelectLevelStats {
    level: number;
    index: string;
    searchable: boolean;
    items: any;
}

/**
 * Arrow for render in different components.
 * @class Arrow
 * @extends {React.Component<IOptionsMenuProps, any>}
 */
export default class SelectLevel extends React.Component<ISelectLevelProps, ISelectLevelStats> {

    constructor(props: any) {
        super(props);
        this.state = {
            level: 0,
            index: '',
            searchable: false,
            items: [{
                level: 0,
                index: '',
                label: 'manager',
                description: '',
                searchProperty: false,
            }],
        };
    }

    transformItems(items: any) {
        let list: ISelectLevel[] = [];
        let level = 0;
        _.forEach(items, (item) => {
            list.push(_.merge(item, {
                level: level++,
            }));
        });
        return list;
    }

    componentWillReceiveProps(newProps: any) {
        const items = this.transformItems(newProps.items);
        let level = 0;
        if (this.state.level !== 0) {
            level = this.state.level;
        }
        this.setState({
            items: items,
            level: level
        });
    }

    componentDidMount() {
        const items = this.transformItems(this.props.items);
        let level = 0;
        if (this.props.index !== undefined) {
            level = _.findIndex(items, {
                index: this.props.index,
            });
            if (level < 0) {
                level = 0;
            }
        }
        this.setState({
            items: items,
            level: level,
        });
    }

    switchLevel(level: number) {
        if (this.props.onChangeLevel) {
            this.props.onChangeLevel(this.state.items[level].index);
        }
        this.setState({
            level: level,
        });
    }

    searchableChange() {
        this.props.onChangeSearch(!this.state.searchable);
        this.setState({
            searchable: !this.state.searchable,
        });
    }

    /**
     * @function render
     * @description Renders the component
     * @returns {ReactElement} markup
     * @memberof Arrow
     */
    public render() {
        const liStyle = {
            width: 100 / this.state.items.length + '%'
        };
        const ulStyle = {
            maxWidth: 96 * this.state.items.length + 'px'
        };
        const borderStyle = {
            width: 100 * (this.state.level + 1) / this.state.items.length + '%'
        };
        const arrowStyle = {
            left: 100 * (2 * (this.state.level + 1) - 1) / (2 * this.state.items.length) + '%'
        };
        const createMarkup = (html) => {
            return {__html: html};
        };
        return (
            <div className='selectLevelContainer'>
                <Row type='flex' align='middle' className={['selectLevelSlider', 'l' + this.state.level].join(' ')}
                     style={ulStyle}>
                    {this.state.items.map((item: ISelectLevel, index: number) => (
                        <li key={index} onClick={this.switchLevel.bind(this, item.level)} style={liStyle}>
                            <hr className='margin'/>
                            <Row type='flex' justify='center' align='center'
                                 className={['levelIcon', this.state.level >= item.level ? 'active' : ''].join(' ')}>
                                <IcoN size={24} name={item.label + '24'}/>
                            </Row>
                            <hr className='margin'/>
                        </li>
                    ))}
                    <div className='active-border' style={borderStyle}/>
                    <div className='receive-arrow' style={arrowStyle}/>
                </Row>
                <div className='selectLevelDetail'>
                    <h4 dangerouslySetInnerHTML={createMarkup(this.state.items[this.state.level].description)}></h4>
                    {this.state.items[this.state.level].searchProperty && (
                        <div className='searchContainer'>
                            <Row type='flex' align='middle'>
                                <label>{this.state.items[this.state.level].searchText === undefined ? 'Show in their search results?' : this.state.items[this.state.level].searchText}</label>
                                <div className='_df _fn'>
                                    <Switch defaultChecked={this.state.searchable}
                                            onChange={this.searchableChange.bind(this)}/>
                                </div>
                            </Row>
                            <p>Non-member accounts can find easily this place just by writing a part of name or id when
                                composing a post.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

