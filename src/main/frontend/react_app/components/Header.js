
//TODO: npm install svg-inline-loader
//TODO: npm install css-loader

//import logo from '../logo.svg'; // не работает
//TODO: npm install svg-inline-loader


// Компонент, который мы создавали сами
// называть с большой буквы


// в {} происходит динамика, можно писать любой js код
function Header(){

    const now = new Date();

    return(
        <div>
            <h3>new react app application</h3>
            <span>Время сейчас: { now.toLocaleTimeString() } </span>
        </div>
    )
}

export default Header;