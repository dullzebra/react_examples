import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
moment.locale('ru');

import Well from 'react-bootstrap/lib/Well';
import UserName from '_components/User/UserName';
import {getColor} from '_components/User/Avatar';

import {
  inputColorPlaceholder,
  fontSizeH3,
} from '!!sass-variable-loader!_sassVars';

const Empty = styled.div`
  text-align: center;
  color:  ${inputColorPlaceholder};
  font-size: ${fontSizeH3};
`;

const Container = styled.div` 
  position: absolute;
  bottom: 0;
  width: 100%; 
  max-height: 100%;
  overflow: auto;
  padding-right: 5px;
 `;

const MessageBox = styled.div` 
  display: flex; 
  justify-content: ${props => props.isMine ? 'flex-end' : 'flex-start'};  
  .well{
    border-radius: 15px 12px 15px 0;
    min-width: 200px;
  }
  .well-success{
    border-radius: 12px 15px 0 15px;
  }
`;

const Name = styled.div`
  font-weight: bold;
  font-size: 90%;
  color: ${props => props.color};
`;

const Date = styled.div`  
  font-size: 90%;
  text-align: right;
`;

const Message = React.memo(({text, date, user, userColor}) => (
  <>
    <Name color={userColor}><UserName id={user} /></Name>
    <div>{text}</div>
    <Date>{moment(date).fromNow()}</Date>
  </>
));

class OrderCommentsList extends React.Component {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.lastMessage?.scrollIntoView();
  }

  render() {
    const {list, manager} = this.props;

    if (!list.length) return <Empty className='centered'>Нет сообщений</Empty>;

    return (
      <Container>
        {list.map((item, index) => {
          const isMine = item.user !== manager;

          return (
            <MessageBox key={item.id} isMine={isMine} ref={el => {
              if (index === list.length - 1) {
                this.lastMessage = el;
              }
            }}>
              <Well bsSize='small' bsStyle={isMine ? 'success' : ''}>
                <Message
                  text={item.comment}
                  date={item.submit_date}
                  user={item.user}
                  userColor={isMine ? getColor(item.user_name) : ''}
                />
              </Well>
            </MessageBox>);
        })}
      </Container>
    );
  }
}

export default OrderCommentsList;

OrderCommentsList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.number.isRequired,
    comment: PropTypes.string,
    submit_date: PropTypes.string,
  })),
  manager: PropTypes.number,
};
