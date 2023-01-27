import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { injectIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Icon, IconButton,
} from '@edx/paragon';

import {
  StarFilled, StarOutline, ThumbUpFilled, ThumbUpOutline,
} from '../../components/icons';
import { commentShape } from '../comments/comment/proptypes';
import { useUserCanAddThreadInBlackoutDate } from '../data/hooks';
import { postShape } from '../posts/post/proptypes';
import ActionsDropdown from './ActionsDropdown';
import { DiscussionContext } from './context';

function HoverCard({
  commentOrPost,
  actionHandlers,
  handleResponseCommentButton,
  addResponseCommentButtonMessage,
  onLike,
  onFollow,
  isClosedPost,
  endorseIcons,
}) {
  const { enableInContextSidebar } = useContext(DiscussionContext);
  const userCanAddThreadInBlackoutDate = useUserCanAddThreadInBlackoutDate();

  return (
    <div className="d-flex flex-row flex-fill justify-content-end align-items-center hover-card mr-n3 position-absolute">
      {userCanAddThreadInBlackoutDate && (
        <div className="actions d-flex">
          <Button
            variant="tertiary"
            className={classNames('px-2.5 py-2 font-size-14', { 'w-100': enableInContextSidebar })}
            onClick={() => handleResponseCommentButton()}
            disabled={isClosedPost}
            style={{
              lineHeight: '20px',
            }}
          >
            {addResponseCommentButtonMessage}
          </Button>
        </div>
      )}

      {endorseIcons !== undefined && (
        <div className="hover-button">
          <IconButton
            src={endorseIcons.icon}
            iconAs={Icon}
            onClick={() => {
              const actionFunction = actionHandlers[endorseIcons.action];
              actionFunction();
            }}
            className={['endorse', 'unendorse'].includes(endorseIcons.id) ? 'text-dark-500' : 'text-success-500'}
            size="sm"
            alt="Endorse"
          />

        </div>
      )}

      {commentOrPost.following !== undefined && (
        <div className="hover-button">
          <IconButton
            src={commentOrPost.following ? StarFilled : StarOutline}
            iconAs={Icon}
            size="sm"
            alt="Follow"
            onClick={(e) => {
              e.preventDefault();
              onFollow();
              return true;
            }}
          />
        </div>
      )}
      <div className="hover-button">
        <IconButton
          src={commentOrPost.voted ? ThumbUpFilled : ThumbUpOutline}
          iconAs={Icon}
          size="sm"
          alt="Like"
          onClick={(e) => {
            e.preventDefault();
            onLike();
          }}
        />
      </div>
      <div className="hover-button ml-auto d-flex">
        <ActionsDropdown commentOrPost={commentOrPost} actionHandlers={actionHandlers} />
      </div>
    </div>
  );
}

HoverCard.propTypes = {
  commentOrPost: PropTypes.oneOfType([commentShape, postShape]).isRequired,
  actionHandlers: PropTypes.objectOf(PropTypes.func).isRequired,
  handleResponseCommentButton: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  onFollow: PropTypes.func,
  addResponseCommentButtonMessage: PropTypes.string.isRequired,
  isClosedPost: PropTypes.bool.isRequired,
  endorseIcons: PropTypes.objectOf(PropTypes.any),
};

HoverCard.defaultProps = {
  onFollow: undefined,
  endorseIcons: undefined,
};

export default injectIntl(HoverCard);
