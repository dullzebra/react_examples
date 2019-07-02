import React from 'react';

import s from './Input.scss';

import classNames from 'classnames/bind';

const cx = classNames.bind(s);


export const InputInsideButton = props => {
  return (
    <div className={s.InputInsideButtonWrap}>
      <div className={s.InputInsideButton} onClick={props.onClick}>
        <svg>
          <use xlinkHref={props.i}/>
        </svg>
      </div>
    </div>
  );
};

export const InputCounter = props => {
  return (
    <div className={s.InputInsideCounterWrap}>
      123
    </div>
  );
};

const Input = field => {
  const {
    customClass,
    limit,
  } = field;
  const wrapClass = cx({
    InputWrap: true,
    InputWrap_withCounter: !!limit,
    [customClass]: !!customClass,
  });
  let inputClass;
  const isGroup = !!field.names;

  if (!isGroup) {
    inputClass = cx({
      Input: true,
      _error: field.meta.touched && field.meta.error,
    });
  }

  return (
    <div className={wrapClass}>
      {isGroup ? (
        <div className={s.InputGroup}>
          {field.names.map((name, i) => {
            inputClass = cx({
              Input: true,
              _error: field[name].touched && field[name].error,
            });
            return (
              <div key={i} className={s.InputGroupItem}>

                <input {...field[name].input}
                  placeholder={field.placeholder[i]}
                  className={inputClass}
                  type={field[name].type}
                  id={field[name].id}
                />
                {field[name].children}
                {field[name].meta.touched
                && field[name].meta.error
                && <div className={s.Error}>{field[name].meta.error}</div>}

              </div>);
          })}

        </div>
      ) : (
        <React.Fragment>

          {limit
          && (
            <div className={s.InputCounter}>
              {limit - field.input.value.length}
            </div>
          )}

          <input {...field.input}
            placeholder={field.placeholder}
            className={inputClass}
            type={field.type}
            id={field.id}
          />

          {field.children}
          {field.meta.touched
          && field.meta.error && <div className={s.Error}>{field.meta.error}</div>}
        </React.Fragment>
      )}

    </div>
  );
};
export default Input;
