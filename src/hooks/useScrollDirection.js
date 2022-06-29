import React, { useCallback, useEffect, useState } from 'react'

const useScrollDirection = () => {
	const [axisY, setAxisY] = useState(document.scrollingElement.scrollHeight);
	const [scrollDirection, setScrollDirection] = useState('');

	// const handleNavigation = useCallback((e) => {

	// 	if (axisY > window.scrollY) {
	// 		setScrollDirection('scrolling Up');
	// 		console.log('scrolling up');
	// 	} else if (axisY < window.scrollY) {
	// 		setScrollDirection('scrolling Down');
	// 		console.log('scrolling down');
	// 	}

	// 	setAxisY(window.scrollY)

	// }, [axisY]);

	// useEffect(() => {

	// 	window.addEventListener('scroll', handleNavigation);

	// 	return () => {
	// 		window.removeEventListener('scroll', handleNavigation);
	// 	};
	// }, [handleNavigation]);

	return [scrollDirection, axisY]
}

export default useScrollDirection