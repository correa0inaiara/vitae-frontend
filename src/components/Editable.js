// Editable.js
import React, { useEffect, useState } from "react";

// Component accept text, placeholder values and also pass what type of Input - input, textarea so that we can use it for styling accordingly
const Editable = ({
	childRef,
	label,
	text,
	type,
	placeholder,
	children,
	...props
}) => {
	// Manage the state whether to show the label or the input box. By default, label will be shown.
	// Exercise: It can be made dynamic by accepting initial state as props outside the component 
	const [isEditing, setEditing] = useState(false);

	// Event handler while pressing any key while editing
	const handleKeyDown = (event, type) => {
		const { key } = event;
		const keys = ["Escape", "Tab"];
		const enterKey = "Enter";
		const allKeys = [...keys, enterKey]; // All keys array

		/* 
			- For textarea, check only Escape and Tab key and set the state to false
			- For everything else, all three keys will set the state to false
		*/
		if (
			(type === "textarea" && keys.indexOf(key) > -1) ||
			(type !== "textarea" && allKeys.indexOf(key) > -1)
		) {
			setEditing(false);
		}
	};

	/*
	- It will display a label is `isEditing` is false
	- It will display the children (input or textarea) if `isEditing` is true
	- when input `onBlur`, we will set the default non edit mode
	Note: For simplicity purpose, I removed all the classnames, you can check the repo for CSS styles
	*/

	useEffect(() => {
		if (childRef && childRef.current && isEditing === true) {
			childRef.current.focus();
		}
	}, [isEditing, childRef]);

	return (
		<div className="detalhe-item" {...props}>
			{isEditing 
			? (
				<div
					onBlur={() => setEditing(false)}
					onKeyDown={e => handleKeyDown(e, type)}
				>
					{children}
				</div>
				
			) : 
			(
				<div
					onClick={() => setEditing(true)}
				>
					<span>
						{text || "Editable content"}
					</span>
				</div>
			)}
		</div>
	);
};

export default Editable;