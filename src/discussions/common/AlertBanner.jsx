import React from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';

import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@edx/paragon';
import { Report } from '@edx/paragon/icons';

import {
  selectModerationSettings, selectUserHasModerationPrivileges, selectUserIsGroupTa, selectUserIsStaff,
} from '../data/selectors';
import messages from '../post-comments/messages';
import AuthorLabel from './AuthorLabel';

const AlertBanner = ({
  author,
  abuseFlagged,
  lastEdit,
  closed,
  closedBy,
  closeReason,
}) => {
  const intl = useIntl();
  const userHasModerationPrivileges = useSelector(selectUserHasModerationPrivileges);
  const userIsGroupTa = useSelector(selectUserIsGroupTa);
  const userIsGlobalStaff = useSelector(selectUserIsStaff);
  const { reasonCodesEnabled } = useSelector(selectModerationSettings);
  const userIsContentAuthor = getAuthenticatedUser().username === author;
  const canSeeReportedBanner = abuseFlagged;
  const canSeeLastEditOrClosedAlert = (userHasModerationPrivileges || userIsGroupTa
    || userIsGlobalStaff || userIsContentAuthor
  );

  return (
    <>
      {canSeeReportedBanner && (
        <Alert icon={Report} variant="danger" className="px-3 mb-1 py-10px shadow-none flex-fill">
          {intl.formatMessage(messages.abuseFlaggedMessage)}
        </Alert>
      )}
      {reasonCodesEnabled && canSeeLastEditOrClosedAlert && (
        <>
          {lastEdit?.reason && (
            <Alert variant="info" className="px-3 shadow-none mb-1 py-10px bg-light-200">
              <div className="d-flex align-items-center flex-wrap text-gray-700 font-style">
                {intl.formatMessage(messages.editedBy)}
                <span className="ml-1 mr-3">
                  <AuthorLabel author={lastEdit?.editorUsername} linkToProfile postOrComment />
                </span>
                <span
                  className="mx-1.5 font-size-8 font-style text-light-700"
                  style={{ lineHeight: '15px' }}
                >
                  {intl.formatMessage(messages.fullStop)}
                </span>
                {intl.formatMessage(messages.reason)}:&nbsp;{lastEdit.reason}
              </div>
            </Alert>
          )}
          {closed && (
            <Alert variant="info" className="px-3 shadow-none mb-1 py-10px bg-light-200">
              <div className="d-flex align-items-center flex-wrap text-gray-700 font-style">
                {intl.formatMessage(messages.closedBy)}
                <span className="ml-1 ">
                  <AuthorLabel author={closedBy} linkToProfile postOrComment />
                </span>
                <span
                  className="mx-1.5 font-size-8 font-style text-light-700"
                  style={{ lineHeight: '15px' }}
                >
                  {intl.formatMessage(messages.fullStop)}
                </span>
                {closeReason && (`${intl.formatMessage(messages.reason)}: ${closeReason}`)}
              </div>
            </Alert>
          )}
        </>
      )}
    </>
  );
};

AlertBanner.propTypes = {
  author: PropTypes.string.isRequired,
  abuseFlagged: PropTypes.bool,
  closed: PropTypes.bool,
  closedBy: PropTypes.string,
  closeReason: PropTypes.string,
  lastEdit: PropTypes.shape({
    editorUsername: PropTypes.string,
    reason: PropTypes.string,
  }),
};

AlertBanner.defaultProps = {
  abuseFlagged: false,
  closed: undefined,
  closedBy: undefined,
  closeReason: undefined,
  lastEdit: {},
};

export default React.memo(AlertBanner);
