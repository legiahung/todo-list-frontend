import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {SelectChangeEvent} from '@mui/material';
import classNames from 'classnames';
import {useRouter} from 'next/router';

import {ROUTES} from '@/configs/routes.config';
import Checkbox from '@/core-ui/checkbox';
import IconButton from '@/core-ui/icon-button';
import api from '@/data/api/index';
import {IStatus} from '@/data/api/types/list.type';
import {ITaskResponse} from '@/data/api/types/task.type';
import {socketUpdateList} from '@/data/socket';

import Status from '../status';
// import style from './style.module.scss';
import style from './style.module.scss';

interface IProp {
  task: ITaskResponse;
  onEdit?: () => void;
  onDelete?: () => void;
  statusList: IStatus[];
  isSelect: boolean;
  readonly: boolean;
}

export default function TaskItem({task, onEdit, onDelete, statusList, isSelect, readonly}: IProp) {
  const router = useRouter();
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: task!.id!});
  statusList?.sort((a, b) => a.id - b.id);
  const statusValue = statusList.filter(e => e.id === task.statusId)[0];

  const setDone = (id: string, isDone: boolean) => {
    if (!id) return;
    api.task
      .update({id, isDone: !isDone})
      .then(socketUpdateList)
      .catch(() => {});
  };

  const styleDnd = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const onChangeStatus = (event: SelectChangeEvent<unknown>) => {
    api.task
      .update({id: task.id, statusId: Number(event.target.value)})
      .then(socketUpdateList)
      .catch(() => {});
  };
  const onDetail = (taskId: string) => {
    router.push(ROUTES.TASK + '/' + taskId);
  };

  return (
    <div
      className={classNames(style.task, `item ${isSelect && 'select'}`)}
      ref={setNodeRef}
      style={styleDnd}
      {...attributes}
      {...listeners}
      onClick={e => {
        const elmCheckbox = e.currentTarget.querySelector('.form-checkbox') as HTMLInputElement | null;
        const elmText = e.currentTarget.querySelector('h6')?.classList;
        if (task?.isDone) {
          elmText?.remove('checked');
          elmCheckbox?.removeAttribute('checked');
        } else {
          elmText?.add('checked');
          elmCheckbox?.setAttribute('checked', '');
        }
      }}
    >
      <Checkbox checked={task?.isDone} onChange={() => setDone(task!.id!, task!.isDone)} disabled={readonly} />
      <p className={`h6 ${task!.isDone ? 'checked' : ''}`} onClick={() => setDone(task!.id!, task!.isDone)}>
        {`${task!.name}`}
      </p>
      <div className="actions">
        {statusList && <Status items={statusList} readOnly={readonly} status={statusValue} onChange={e => onChangeStatus(e)} />}
        {!readonly && (
          <>
            <IconButton name="ico-edit" size={20} onClick={onEdit} />
            <IconButton name="ico-trash-2" size={20} onClick={onDelete} />
          </>
        )}
        <IconButton name="ico-chevron-right" onClick={() => onDetail(task.id)} />
      </div>
    </div>
  );
}
