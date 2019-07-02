import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import Button from '_uicomponents/Button/Button.js';
import Input from '_uicomponents/Input/Input.js';
import InputFile from '_uicomponents/InputFile/InputFile.js';
import Textarea from '_uicomponents/Textarea/Textarea.js';
import CustomSelect from '_uicomponents/CustomSelect/CustomSelect.js';
import classNames from 'classnames/bind';
import s from './FeedbackForm.scss';

const cx = classNames.bind(s);

class FeedbackForm extends React.Component {
  state = {
    formSuccess: false,
  }

  subjectOptions = [
    'Я владелец организации и хочу обновить данные',
    'Сервис показал ошибку или не работает',
    'Карточка устарела, организация больше не существует или переехала',
  ]

  getOptions() {
    return this.subjectOptions.map( option => ({
      id: option,
      name: option,
    }));
  }

  onSubmit = data => {
    const formData = new FormData();

    if (data.subject && data.subject.length) {
      formData.append('subject', data.subject[0]);
    }

    if (data.first_name) {
      formData.append('first_name', data.first_name);
    }

    if (data.email) {
      formData.append('email', data.email);
    }

    if (data.text) {
      formData.append('text', data.text);
    }

    if (data.file) {
      formData.append('file', data.file);
    }
    return this.props.send(formData)
      .then(res => {
        this.setState({formSuccess: true});
      })
      .catch(res => {
        if (res.response && res.response.status === 400) {
          throw new SubmissionError({
            email: res.response.data.email,
            file: res.response.data.file,
          });
        } else if (res.response && res.response.status === 413) {
          throw new SubmissionError({
            file: 'Файл слишком большой',
          });
        } else {
          throw new SubmissionError({
            _error: 'Произошла ошибка',
          });
        }
      });
  }

  render() {
    const { handleSubmit, submitting, cancel, error } = this.props;
    return (
      <React.Fragment>
        <div className={cx({Hide: this.state.formSuccess})}>
          <div className={s.FeedbackFormTitle}>Обратная связь</div>
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className={s.FeedbackFormInner}>
              <div className={s.FeedbackFormField}>
                <Field
                  name={'first_name'}
                  placeholder={'Ваше имя'}
                  component={Input}
                />
              </div>
              <div className={s.FeedbackFormField}>
                <Field
                  name={'email'}
                  placeholder={'Почта'}
                  component={Input}
                />
              </div>
              <div className={s.FeedbackFormField}>
                <Field
                  name={'subject'}
                  component={CustomSelect}
                  options={this.getOptions()}
                  placeholder={'Тема обращения'}
                  customClass={s.Subject}
                />
              </div>
              <div className={s.FeedbackFormField}>
                <Field
                  name={'file'}
                  label={'Файл'}
                  component={InputFile}
                />
              </div>
              <div className={s.FeedbackFormField}>
                <Field
                  name={'text'}
                  placeholder={'Сообщение'}
                  component={Textarea}
                />
              </div>
              {error && <div className={s.Error}>{error}</div>}
              <div className={s.FeedbackFormButtons}>
                <Button
                  type='button'
                  onClick={cancel}
                  bg='transparent'
                >закрыть
                </Button>
                <Button
                  type={'submit'}
                  disabled={submitting}
                >отправить
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className={cx({Hide: !this.state.formSuccess, FeedbackFormInner: true})}>
          <div className={s.FeedbackFormTitle}>Спасибо за ваш отзыв!</div>
          <div className={cx({FeedbackFormButtons: true, FeedbackFormButtonsSuccess: true})}>
            <Button
              type='button'
              bg='transparent'
              onClick={cancel}
            >закрыть
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const validate = values => {
  const errors = {};

  if (!values.subject || !values.subject.length) {
    errors.subject = 'Укажите тему сообщения';
  }
  return errors;
};

export default reduxForm({
  form: 'FeedbackForm',
  validate,
})(FeedbackForm);
