import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.brand}>
          <img src="/favicon.svg" alt="" className={styles.logo} aria-hidden="true" />
          BitCrafts
        </span>
        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
          >
            About me
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
          >
            Blog
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
