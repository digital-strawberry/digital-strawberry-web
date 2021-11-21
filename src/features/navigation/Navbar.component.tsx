import React from 'react';
import styles from './Navbar.module.css';

export type NavbarProps = Record<never, string>;

export const Navbar: React.FC<NavbarProps> = () => {
	return (
		<nav className={styles.nav}>
			Разметчика не взяли!
			<span>Digital Strawberry 🍓😏</span>
		</nav>
	);
};
