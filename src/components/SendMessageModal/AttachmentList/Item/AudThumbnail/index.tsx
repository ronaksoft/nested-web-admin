/**
 * @file scenes/compose/AttachmentList/Item/AudThumbnail/index.tsx
 * @author naamesteh < naamesteh@nested.me >
 * @description specially renders Audio type attachments
 * inside upload attachment in compose page
 *              Documented by:          Shayesteh Naeimabadi
 *              Date of documentation:  2017-08-01
 *              Reviewed by:            rozizo
 *              Date of review:         2017-08-01
 */
import * as React from 'react';
import IAttachmentItem from '../IAttachmentItem';
import FileUtil from '../../../../../services/classes/utils/file';
import '../composeAttachment.css';

/**
 * @name IProps
 * @interface IProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 * @property {IAttachmentItem} attachment - list of attachments
 * @property {boolean} fullWidth - does it need to render thumbnail in full width of screen
 */
interface IProps {
  item: IAttachmentItem;
  fullWidth?: boolean;
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 * @property {IAttachmentItem} attachment
 */
interface IState {
  item: IAttachmentItem;
}

/**
 * @export
 * @class AudioThumbnail
 * @classdesc render the thumbnails of video attachments
 * @extends {React.Component<IProps, IState>}
 */
export default class AudioThumbnail extends React.Component<IProps, IState> {
  /**
   * renders the video preview in post card
   * @function
   * @returns {ReactElement} markup
   * @memberof AudioThumbnail
   * @override
   * @generator
   */
  public render() {
    const { item } = this.props;
    const hasThumb = item.model && item.model.thumbs.x64;
    return (
      <div key={item.id}>
        {hasThumb ? (
          <img src={FileUtil.getViewUrl(item.model.thumbs.x64)} style={{ width: 40, height: 40 }} alt={item.model.name} />
        ) : (
          <div key={item.id} className={'imageContainer'}>
            <div className={'filesTypesImages'}>
              <div className="fileBadge fileBadgeAud">AUD</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
