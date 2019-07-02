import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Breadcrumb from 'react-bootstrap/lib/Breadcrumb';
import Panel from 'react-bootstrap/lib/Panel';
import ForumComments from './ForumComments';
import UserName, {UserList} from '_components/User/UserName';
import {getForumBsStyle} from '_utils';
import {path} from '_config/url';
import { panelHeadingPadding } from '!!sass-variable-loader!_sassVars';

const Body = styled.div`
  & img{
    max-width: 100%;
  }
`;
const PanelHeading = styled(Panel.Heading)`
  position: relative;
`;
const Member = styled.div`
  font-size: .9em;
`;

const RightLink = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin: ${panelHeadingPadding};
`;

const ForumItem = ({currentUserId, item}) => (
  <div>
    <Breadcrumb>
      <Breadcrumb.Item componentClass={Link} href={`${path.forum}`} to={`${path.forum}`}>
        К списку форумов
      </Breadcrumb.Item>
    </Breadcrumb>

    <Panel bsStyle={getForumBsStyle(item.public)}>
      <PanelHeading>
        <Member>
        Автор: <strong><UserName id={item.user} /></strong>
          {item.members.length > 0 &&
        <div>Участники: <strong>
          <UserList ids={item.members.filter(m => m !== item.user)} />
        </strong></div>}
        </Member>
        {currentUserId === item.user &&
        <RightLink>
          <Link to={`${path.forumEditTopic}${item.id}`}>Редактировать</Link>
        </RightLink>
        }
      </PanelHeading>

      <Panel.Body>
        <div className='lead'>{item.title}</div>
        <Body dangerouslySetInnerHTML={{__html: item.description}} />
      </Panel.Body>
    </Panel>
    <ForumComments id={item.id} />
  </div>
);

export default ForumItem;

ForumItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    user: PropTypes.number,
  }),
};
