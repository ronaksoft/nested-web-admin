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
import {IcoN} from '../icon/index';
import {Row, Switch} from 'antd';
import ISelectLevel from './ISelectLevel';

const NST_PLACE_POLICY_OPTION = {
  MANAGERS: 0,
  MEMBERS: 1,
  TEAMMATES: 2,
  EVERYONE: 3,
};

interface ISelectLevelProps {
  items: Array<ISelectLevel>;
  onChangeLevel?: (level: number) => void;
  onChangeSearch?: (level: boolean) => void;
  level?: number;
}
interface ISelectLevelStats {
  level: number;
  searchable: boolean;
  items: Array<ISelectLevel>;
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
      level : 0,
      searchable: false,
      items: [{
        index: 0,
        label: 'manager',
        description: '',
        searchProperty: false,
      }],
    };
  }

  componentDidMount() {
    this.setState({
      items: this.props.items,
    });
  }

  switchLevel(index: number) {
    if (this.props.onChangeLevel) {
      this.props.onChangeLevel(index);
    }
    this.setState({
      level : index,
    });
  }

  searchableChange() {
    this.props.onChangeSearch(!this.state.searchable);
    this.setState({
      searchable : !this.state.searchable,
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
      width: 100 * (this.state.level + 1) /  this.state.items.length + '%'
    };
    const arrowStyle = {
      left: 100 * (2 * (this.state.level + 1) - 1) / (2 * this.state.items.length) + '%'
    };
    return (
      <div className='selectLevelContainer'>
        <Row type='flex' align='middle' className={['selectLevelSlider', 'l' + this.state.level].join(' ')} style={ulStyle}>
          {this.state.items.map((item: ISelectLevel, index: number) =>  (
              <li key={index} onClick={this.switchLevel.bind(this, item.index)} style={liStyle}>
                <hr className='margin'/>
                <Row type='flex' justify='center' align='center'
                     className={['levelIcon', this.state.level >= item.index ? 'active' : ''].join(' ')}>
                  <IcoN size={24} name={item.label + '24'}/>
                </Row>
                <hr className='margin'/>
              </li>
          ))}
          <div className='active-border' style={borderStyle}/>
          <div className='receive-arrow' style={arrowStyle} />
        </Row>
        <div className='selectLevelDetail'>
          <h4>{this.state.items[this.state.level].description}</h4>
          {this.state.items[this.state.level].searchProperty && (
            <div className='searchContainer'>
              <Row type='flex' align='middle'>
                <label>Show in their search results?</label>
                <div className='_df _fn'>
                  <Switch defaultChecked={this.state.searchable} onChange={this.searchableChange.bind(this)} />
                </div>
              </Row>
              <p>Non-member accounts can find easly this place just by writing a part of name or id when composing a post.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

