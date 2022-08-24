import {yupResolver} from '@hookform/resolvers/yup';
import cn from 'classnames';
import {useRouter} from 'next/router';
import React from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import * as yup from 'yup';

import API from '@/api/network/user';
import TodoListLogo from '@/components/icons/todolist-logo';
import {ROUTES} from '@/configs/routes.config';
import Button from '@/core-ui/button';
import Input from '@/core-ui/input';
import useMediaQuery from '@/hooks/useMediaQuery';

import styles from './style.module.scss';

interface IFormInputs {
  userName: string;
}

const Schema = yup.object().shape({
  userName: yup
    .string()
    .required('Please fill all the required fields.')
    .max(20, 'Should smaller than 20 charaters.')
    .min(2, 'Username must be at least 2 characters.')
});

const QuickPlay: React.FC = () => {
  const router = useRouter();
  const {register, handleSubmit, formState} = useForm<IFormInputs>({
    resolver: yupResolver(Schema)
  });

  const {errors} = formState;

  const onSubmit: SubmitHandler<IFormInputs> = data => {
    API.createUser(data).then(res => {
      if (res.status === 201) {
        localStorage.setItem('userName', data.userName);
        router.push(ROUTES.ACTION);
      }
    });
  };

  const matches = useMediaQuery('(min-width:640px)');

  return (
    <div className={cn(styles['com-action'])}>
      <div className="container">
        <div className="inner">
          <div className="logo-wrapper">
            <TodoListLogo width={matches ? 249 : 175} />
          </div>
          <div className="enter-your-name">
            <h2>Let&apos;s start !</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input className={errors.userName && 'error'} placeholder="Enter your name" {...register('userName')} />
              {errors.userName && <p className="invalid">{errors.userName.message}</p>}
              <Button className="btn-submit" type="submit" variant="contained">
                Enter
              </Button>
            </form>
          </div>
          <div className="copyright">Copyright © 2022 By ABC Software Solutions Company.</div>
        </div>
      </div>
    </div>
  );
};

export default QuickPlay;