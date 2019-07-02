import React from 'react';
import s from './SocialSettings.scss';
import classNames from 'classnames/bind';
import SocialEditor from './Editors/SocialEditor.js';
import { OAuth2 } from '_config/config.js';

const cx = classNames.bind(s);

const Icon = ({ children, ...rest }) => (<i {...rest}><svg><use xlinkHref={`#ic-${children}`} /></svg></i>);

class SocialSettings extends React.Component {
  state = {
    action: null,
    actionData: null,
    providerName: null,
    provider: null,
  }

  onActiveIconClick(providerId, providerName, provider) {
    this.setState({action: 'off', actionData: providerId, providerName, provider});
  }

  onConfirmAction = () => {
    const { actionData, provider } = this.state;
    this.props.onDeleteService(actionData, provider);
    this.closeModal();
  }

  closeModal = () => {
    this.setState({action: null, actionData: null, providerName: null, provider: null});
  }

  mapServicesToObj = () => {
    const { activeServices } = this.props;
    const serviceObj = {};
    activeServices.map(s => {
      serviceObj[s.provider] = s.id;
    });
    return serviceObj;
  }

  renderActive = (i, name, providerId, provider) => {
    return (
      <span key={i}
        className={cx(s.SocialLink, s.Connected)}
        title={`Отвязать ${name}`}
        onClick={this.onActiveIconClick.bind(this, providerId, name, provider)}
      >
        <Icon>{name}</Icon>
        <Icon className={s.IconConnected}>done</Icon>
      </span>
    );
  }

  renderInactive = (i, name, connectUrl) => {
    return (
      <a key={i}
        className={cx(s.SocialLink)}
        title={`Привязать ${name}`}
        href={connectUrl}
      >
        <Icon>{name}</Icon>
      </a>
    );
  }

  render() {
    const userSocials = this.mapServicesToObj();
    const { action } = this.state;
    return (
      <div className={s.Social}>
        {OAuth2.map((social, i) => {
          if (social.provider in userSocials) {
            return this.renderActive(i, social.name, userSocials[social.provider], social.provider);
          } else {
            return this.renderInactive(i, social.name, social.url);
          }
        })}
        <SocialEditor
          isOpen={!!action}
          onSave={this.onConfirmAction}
          onClose={this.closeModal}
        >
          Отключить социальную сеть <Icon className={s.IconInModal}>{this.state.providerName}</Icon> ?
        </SocialEditor>
      </div>
    );
  }
}

export default SocialSettings;
