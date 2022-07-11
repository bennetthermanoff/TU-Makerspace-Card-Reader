import { styled } from '@mui/system';
import { switchUnstyledClasses } from '@mui/base/SwitchUnstyled';

/* code from mui website */

// green
const enabled = {
    500: '#008000',
    600: '#228A4F',
  };
// the faded blue
  const switchbackground = {
    100: '#E7EEFC',
  };
  let Root;
  const darkTheme = window.matchMedia('(prefers-color-scheme: dark)');
  window.matchMedia('(prefers-color-sceheme: dark').addEventListener('change', event => {
    const newColorScheme = event.matches;
  });
const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

if (userPrefersDark) {
  // dark mode
  Root = styled('span')(
    ({ theme }) => `
    font-size: 0;
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
    cursor: pointer;
    background-color: #D2F0DC;
    border: 1px solid #006747;
    border-radius: 16px;
    vertical-align: middle;
    margin-left: 5px;
    opacity: 1;
    margin-top:5px;
    &.${switchUnstyledClasses.disabled} {
      opacity: 0.4;
      cursor: not-allowed;
    }
    
    & .${switchUnstyledClasses.track /* pretty sure this takes from the theme */} {
      background: ${'#9DCAB2'};
      border-radius: 15px;
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
    }
  
    & .${switchUnstyledClasses.thumb /* this is the circle that travels */} {
      display: block;
      width: 24px;
      height: 24px;
      top: 3px;
      left: -15px;
      border-radius: 16px;
      background-color: #fff;
      position: relative;
      transition: all 200ms ease;
      background-color: #288F65;
    }
  
    &.${switchUnstyledClasses.focusVisible} .${switchUnstyledClasses.thumb} {
      background-color: ${'switchbackground[100]'};
      box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
    }
    &.${switchUnstyledClasses.checked} {
      .${switchUnstyledClasses.thumb /* circle moves when toggled */} {
        left: 15px;
        top: 3px;
        background-color: #B1E3C8;
      }
  
      .${switchUnstyledClasses.track /* the color of the oval when it's toggled on */} {
        background: ${'#288F65'};
      }
    }
  
    & .${switchUnstyledClasses.input /* idk */} {
      cursor: inherit;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: 1;
      margin: 0;
    }
    
    `,
  );

} else {
  // the oval that the circle travels in
  Root = styled('span')(
    ({ theme }) => `
    font-size: 0;
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
    cursor: pointer;
    background-color: #DEEFE5;
    border: 1px solid #006747;
    border-radius: 16px;
    vertical-align: middle;
    margin-left: 5px;
    opacity: 1;
  
    &.${switchUnstyledClasses.disabled} {
      opacity: 0.4;
      cursor: not-allowed;
    }
  
    & .${switchUnstyledClasses.track /* pretty sure this takes from the theme */} {
      background: ${switchbackground[100]};
      border-radius: 15px;
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
    }
  
    & .${switchUnstyledClasses.thumb /* this is the circle that travels */} {
      display: block;
      width: 24px;
      height: 24px;
      top: 3px;
      left: 3px;
      border-radius: 16px;
      background-color: #fff;
      position: relative;
      transition: all 200ms ease;
      background-color: #9DCAB2;
    }
  
    &.${switchUnstyledClasses.focusVisible} .${switchUnstyledClasses.thumb} {
      background-color: ${switchbackground[100]};
      box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
    }
  
    &.${switchUnstyledClasses.checked} {
      .${switchUnstyledClasses.thumb /* circle moves when toggled */} {
        left: 33px;
        top: 3px;
        background-color: #DEEFE5;
      }
  
      .${switchUnstyledClasses.track /* the color of the oval when it's toggled on */} {
        background: ${'#288F65'};
      }
    }
  
    & .${switchUnstyledClasses.input /* idk */} {
      cursor: inherit;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: 1;
      margin: 0;
    }

    `,
  );
}

  export default Root;