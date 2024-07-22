import { useContext } from 'react';
import { DispatchContext, StatesContext } from '../context/Store';
import { Filter } from '../types/Filter';
import classNames from 'classnames';
import { deleteTodo } from '../api/todos';

export const Footer: React.FC = () => {
  const { todos, filter } = useContext(StatesContext);
  const dispatch = useContext(DispatchContext);
  const todosLeft = todos.filter(t => !t.completed);

  function handleFilterClick(selectedFilter: Filter) {
    dispatch({ type: 'setFilter', payload: selectedFilter });
  }

  const handleClearClick = async () => {
    const deletedTodos = todos.filter(t => t.completed);

    Promise.all(
      deletedTodos.map(async todo => {
        deleteTodo(todo.id)
          .then(() => dispatch({ type: 'deleteTodo', payload: todo.id }))
          .catch(() =>
            dispatch({ type: 'showError', payload: 'Unable to delete a todo' }),
          );
      }),
    );
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterClick(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterClick(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterClick(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClearClick()}
        disabled={todos.length === 0 || !todos.some(t => t.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
