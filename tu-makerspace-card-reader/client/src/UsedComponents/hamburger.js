import React from 'react';
import './hamburger.css';

export default function Hamburger() {
  return (
    <>
      <input id="hamburger-input" type="checkbox" />
      <label id="hamburger-menu" htmlFor="hamburger-input">
      <div className="line-container">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <nav id="sidebar-menu">
        <h3>Menu</h3>
        <ul>
          <form action="/">
            <button className="menu-label">
              <h2 className="menu-label2">Home</h2>
              </button>
            </form>
          <form action="/metal-shop-1">
            <button className="menu-label">
              <h2 className="menu-label2">Metal Shop 1</h2>
            </button>
          </form>
          <form action="/metal-shop-2">
            <button className="menu-label">
              <h2 className="menu-label2">Metal Shop 2</h2>
            </button>
          </form>
          <form action="/wood-shop">
            <button className="menu-label">
              <h2 className="menu-label2">Wood Shop</h2>
            </button>
          </form>
          <form action="/printers-and-lasers">
            <button className="menu-label">
              <h2 className="menu-label2">Printers & Lasers</h2>
            </button>
          </form>
          <form action="/edit-user">
            <button className="menu-label">
              <h2 className="menu-label2">Edit User</h2>
            </button>
          </form>
          <form action="/add-user">
            <button className="menu-label">
              <h2 className="menu-label2">Add User</h2>
              </button>
          </form>
          
          
        </ul>
      </nav>
    </label>
    
      <div className="overlay"></div>
    </>
  )
}
