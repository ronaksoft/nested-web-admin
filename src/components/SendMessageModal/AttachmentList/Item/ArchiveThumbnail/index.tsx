/**
 * @file scenes/compose/AttachmentList/Item/ArchiveThumbnail/index.tsx
 * @author naamesteh < naamesteh@nested.me >
 * @description specially renders Archive type attachments
 * inside upload attachment in compose page
 *              Documented by:          Shayesteh Naeimabadi
 *              Date of documentation:  2017-08-01
 *              Reviewed by:            robzizo
 *              Date of review:         2017-08-01
 */
import * as React from 'react';
import FileUtil from '../../../../../services/classes/utils/file';
import '../composeAttachment.css';
import IAttachmentItem from '../IAttachmentItem';

/**
 * @name IProps
 * @interface IProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 * @property {IPostAttachment} attachment
 */
interface IProps {
  item: IAttachmentItem;
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 * @property {IPostAttachment} attachment
 */
interface IState {
  item: IAttachmentItem;
}

/**
 * @export
 * @class OtherThumbnail
 * @classdesc render the thumbnails of attachments
 * @extends {React.Component<IProps, IState>}
 */
export default class ArchiveThumbnail extends React.Component<IProps, IState> {
  /**
   * renders the attachment element related to attachment type
   * @function
   * @returns {ReactElement} markup
   * @memberof ArchiveThumbnail
   * @override
   * @generator
   */
  public render() {
    const { item } = this.props;
    const name = item.model ? item.model.name : item.name;
    return (
      <div key={item.id}>
        <div key={item.id} className="imageContainer">
          <div className="filesTypesImages">
            <div className="fileBadge fileBadgeArchive">
              {FileUtil.getSuffix(name).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
