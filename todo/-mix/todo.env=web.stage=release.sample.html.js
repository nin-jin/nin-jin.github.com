$jin.sample.strings( '<div jin-todo-intro=""\n	>\n	\n	<div jin-todo-intro-title="">\n		To Do\n	</div>\n	\n	<div jin-todo-intro-description="">\n		Привет, мир!\n	</div>\n	\n</div>\n<div jin-todo-noitems=""\n	>\n	Нет задач. Добавить новую вы можете через панель инструментов сверху.\n</div>\n<div jin-task-view-details="">\n	<div\n		jin-task-view-details-title=""\n		contenteditable="{editableTitle}"\n		jin-sample-events="$jin.dom.event.onInput=onChangeTitle"\n		>\n		{title}\n	</div>\n	<div\n		jin-task-view-details-description=""\n		contenteditable="{editableDescription}"\n		visible="{visibleDescription}"\n		jin-sample-events="$jin.dom.event.onInput=onChangeDescription"\n		>\n		{description}\n	</div>\n</div>\n<div jin-task-view-item=""\n	jin-task-view-item-current="{current}"\n	>\n	<a jin-task-view-item-link=""\n		href="{uri}"\n		tabindex="0"\n		jin-sample-events="\n			$jin.dom.event.onDoubleClick=onReActivate\n		"\n		>\n		<div jin-task-view-item-dropper=""\n			jin-sample-events="\n				$jin.dom.event.onClick=onTaskDrop\n			"\n			>\n			×\n		</div>\n		<div jin-task-view-item-title=""\n			jin-task-view-item-title-default="{uri}"\n			>\n			{title}\n		</div>\n	</a>\n</div>\n<div jin-todo-view=""\n	jin-sample-events="\n		$jin.dnd.onOver=onResizeMove\n		$jin.dnd.onEnter=onResizeMove\n	"\n	>\n	\n	<div jin-todo-view-panel=""\n		jin-sample-props="style.flexShrink=shrinkDetails"\n		>\n		{details}\n	</div>\n	\n	<div jin-todo-view-resizer=""\n		jin-sample-events="$jin.dnd.onStart=onResizeStart"\n		>\n	</div>\n	\n	<div jin-todo-view-panel=""\n		jin-sample-props="style.flexShrink=shrinkList"\n		>\n		<div jin-todo-view-toolbar="">\n			<div jin-todo-view-create=""\n				tabindex="0"\n				jin-sample-events="$jin.dom.event.onClick=onAddTask"\n				>\n				Добавить\n			</div>\n			<div jin-todo-view-clear=""\n				tabindex="0"\n				jin-sample-events="$jin.dom.event.onClick=onClear"\n				>\n				Очистить\n			</div>\n		</div>\n		<div jin-todo-view-list-pane="">{items}</div>\n	</div>\n	\n</div>\n<div jin-task-view-item=""\n	jin-task-view-item-current="{current}"\n	>\n	<a jin-task-view-item-link=""\n		href="{uri}"\n		tabindex="0"\n		>\n		<div jin-task-view-item-title=""\n			jin-task-view-item-title-default="{uri}"\n			>\n			{title}\n		</div>\n	</a>\n</div>\n<div jin-task-view-details="">\n	<div\n		jin-task-view-details-title=""\n		contenteditable="{editableTitle}"\n		jin-sample-events="$jin.dom.event.onInput=onChangeTitle"\n		>\n		{title}\n	</div>\n	<div\n		jin-task-view-details-description=""\n		contenteditable="{editableDescription}"\n		visible="{visibleDescription}"\n		jin-sample-events="$jin.dom.event.onInput=onChangeDescription"\n		>\n		{description}\n	</div>\n</div>\n' )
