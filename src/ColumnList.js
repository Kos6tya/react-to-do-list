import React from 'react';
import PropTypes from 'prop-types';
import {CSSTransitionGroup} from 'react-transition-group';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import MobileTearSheet from './MobileTearSheet';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import TextField from 'material-ui/TextField';
import './ColumnList.css';

const propTypes = {
	title: PropTypes.string.isRequired,
	items: PropTypes.array,
	updateTask: PropTypes.func.isRequired,
	removeTask: PropTypes.func.isRequired,
	removeMode: PropTypes.bool,
	editMode: PropTypes.bool, 
};

const defaultProps = {
	items: [],
	removeMode: [],
	editMode: false, 
};

class ColumnList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editedTasks: {},
		};
	}

	handleEditTaskChange = (event, id) => {
		const { value } = event.target;
		this.setState(prevState => ({
			editedTasks: {
				...prevState.editedTasks,
				[id]: value,
			},
		}));
	};

	handleEditTaskSubmit = (id) => {
		const { editedTasks } = this.state;
		const newTitle = editedTasks[id];
		if (newTitle) {
			const updatedTask = { ...this.props.items.find(item => item.id === id), title: newTitle };
			this.props.updateTask(updatedTask);
		}
	};

	render() {
		const { editMode, items, removeMode, updateTask, removeTask } = this.props;
		const { editedTasks } = this.state;

		return (
			<div className="column-list">
				<MobileTearSheet style={{padding: 10}}>
					<List>
						<CSSTransitionGroup
							transitionName="task-animation"
							transitionEnterTimeout={500}
							transitionLeaveTimeout={300}>
							{items.map(item => (
								<ListItem
									key={item.id + item.title}
									onClick={() => (removeMode ? removeTask(item) : updateTask(item))}
									rightIcon={removeMode ? <DeleteIcon /> :
										<DeleteIcon style={{visibility: 'hidden'}} />}
								>
									{editMode ? (
										<TextField
											value={editedTasks[item.id] !== undefined ? editedTasks[item.id] : item.title}
											onChange={(e) => this.handleEditTaskChange(e, item.id)}
											onBlur={() => this.handleEditTaskSubmit(item.id)}
											fullWidth
										/>
									) : (
										<Checkbox
											label={item.title}
											disabled={removeMode}
											checked={item.status === 'Done'}
											className={(item.status === 'Done') ? 'task-done' : ''}
										/>
									)}
								</ListItem>
							))}
						</CSSTransitionGroup>
					</List>
				</MobileTearSheet>
			</div>
		);
	}
}

ColumnList.propTypes = propTypes;
ColumnList.defaultProps = defaultProps;

export default ColumnList;
