import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import Panel from 'react-bootstrap/lib/Panel';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import ForumTopics from '_components/Forum/ForumTopics';
import LoadMore from '_components/LoadMore/LoadMore';
import {Link} from 'react-router-dom';
import {path} from '_config/url';
import {getForumBsStyle} from '_utils';

const List = styled.div`
  margin-top: 2em;
`;

const Description = styled.div`
  margin-top: 3px;
  font-size: .8em;
  p {
    margin: 0;
  }
`;

class ForumSections extends React.Component {
  render() {
    const {
      sections,
      currentUserId,
      topics,
      showItem,
      loadMore,
      removeTopic,
    } = this.props;

    return (<List>
      {sections.map(s => {
        const bsStyle = getForumBsStyle(s.public);
        const next = topics[s.id].next;

        return (
          <Panel key={s.id} bsStyle={bsStyle}>
            <Panel.Heading>
              <Panel.Title componentClass='h3'>
                {s.title}
                {!s.public && ` | Участников: ${s.members.length}`}
              </Panel.Title>
              <Description dangerouslySetInnerHTML={{__html: s.description}}/>
            </Panel.Heading>
            <Panel.Body>

              {!isEmpty(topics[s.id].results) &&
                <ForumTopics
                  list={topics[s.id].results || []}
                  bsStyle={bsStyle}
                  showItem={showItem}
                  removeTopic={removeTopic}
                  currentUserId={currentUserId}
                />}

              <ButtonToolbar>
                {next &&
                  <LoadMore
                    loadMore={loadMore}
                    next={next}
                    bsSize='small'
                    bsStyle='default'
                  />
                }
                <Button
                  bsSize='small'
                  bsStyle={bsStyle}
                  componentClass={Link}
                  href={path.forumNewTopic}
                  to={{
                    pathname: path.forumNewTopic,
                    state: {forum: s.id, public: s.public},
                  }}
                >
                    Новая тема
                </Button>
              </ButtonToolbar>
            </Panel.Body>
          </Panel>
        );
      })}
    </List>
    );
  }
}


export default ForumSections;

ForumSections.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      description: PropTypes.string,
      members: PropTypes.arrayOf(PropTypes.number),
    })
  ),
  topics:
    PropTypes.objectOf(
      PropTypes.shape({
        results: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string,
            user: PropTypes.number,
          })
        ),
      })
    ),
  showItem: PropTypes.func,
};

