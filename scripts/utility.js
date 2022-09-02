/* eslint-disable react-hooks/rules-of-hooks */
const path = require('path');
const child_process = require('child_process');

const blessed = require('blessed');


// #region - Constants 
// -------------------

const DEPENDENCIES_DICT = {
  reactNativeIosUtilities: {
    localDIR: '',
    packageName: 'react-native-ios-utilities'
  },
};

const PAGE_KEYS = {
  chooseScriptForm: "chooseScriptForm",
  scriptOutput: "scriptOutput",
};

const ID_KEYS = {
  scriptChoice: "scriptChoice",
};

const SCRIPT_CHOICE_KEYS = {
  exampleLocalDepInstallSoft: 'exampleLocalDepInstallSoft',
  exampleLocalDepInstallHard: 'exampleLocalDepInstallHard',

  libraryLocalDepInstallSoft: 'libraryLocalDepInstallSoft',

  localDepInstallSoft: 'localDepInstallSoft',
};

const RADIO_CHOICES_TYPES = {
  choice: 'choice',
  spacer: 'spacer',
};

const RADIO_CHOICES = [{
  title: "Example - Local Install - Dep. - Soft ",
  subtitle: "Install example package dependencies w/o resetting",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.exampleLocalDepInstallSoft,

}, {
  title: "Example - Local Install - Dep. - Hard ",
  subtitle: "Clean install example package dependencies - Hard Reset",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.exampleLocalDepInstallHard,

}, {
  type: RADIO_CHOICES_TYPES.spacer,
  spaceAmount: 1,

}, {
  title: "Library - Local Install - Dep. - Soft ",
  subtitle: "Install library dev. dependencies w/o resetting",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.libraryLocalDepInstallSoft,

}, {
  type: RADIO_CHOICES_TYPES.spacer,
  spaceAmount: 1,

}, {
  title: "Local Install - Dep. - Soft ",
  subtitle: "Install library dev. dep. + example dep. w/o resetting",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.localDepInstallSoft,
}];

// #endregion

class Helpers {
  static spawn(command, streamListener){
    return new Promise(resolve => {
      const childProcess = child_process.spawn(command, {
        shell: true,
      }, {
        cwd: process.cwd(),
        env: process.env,
        encoding: 'utf-8'
      });

      childProcess.stdout.on('data', (data) => {
        streamListener({
          stdout: `${data.toString()}`
        });
      });

      childProcess.stderr.on('data', (data) => {
        streamListener({
          stderr: `${data.toString()}`
        });
      });

      childProcess.on('exit', (code, signal) => {
        resolve({code, signal});
      });
    });
  };
};

class Scripts {
  static async testHelloWorld(listener){
    listener({status: "Testing... Hello world"});

    await Helpers.spawn(
      `echo "Hello World from terminal via echo..."`, 
      listener
    );

    listener({status: "Testing... 1"});


    await Helpers.spawn(
      `echo "ls -l"`, 
      listener
    );

    await Helpers.spawn(
      `node --version`, 
      listener
    );

    listener({status: "Testing... 2"});

    await Helpers.spawn(
      `npm --version`, 
      listener
    );

    listener({status: "Testing... 2.1"});

    await Helpers.spawn(
      `pod --version`, 
      listener
    );

    listener({status: "Testing... 2.2"});

    await Helpers.spawn(
      `yarn --version`, 
      listener
    );

    listener({status: "Testing... 3"});

    await Helpers.spawn(
      `cal`, 
      listener
    );

    listener({status: "Testing... 4"});

    await Helpers.spawn(
      `cd example && ls && cd ios && ls && cd Pods && ls`, 
      listener
    );

    listener({status: "Test complete."});

  };

  static async refreshLocalLibraries(listener){
    listener({status: "Refreshing local libraries...."});

    await Helpers.spawn(
      `echo 'Refresh Library - react-native-ios-utilities' && echo "DIR: $REACT_NATIVE_IOS_UTILITIES_DIR"`, 
      listener
    );

    await Helpers.spawn(
      `cd $REACT_NATIVE_IOS_UTILITIES_DIR && yarn run bob build`, 
      listener
    );
  };

  static async exampleOpenXcode(listener){
    listener({status: "Opening example xcworkspace..."});

    await Helpers.spawn(
      `open ./example/ios/IosPopoverExample.xcworkspace`, 
      listener
    );
  }; 

  static async exampleDeleteWorkspace(listener){
    const skipDeletingWorkspace = true;

    const prefix = "cd example/ios";

    listener({status: "Begin deleting example ios workspace project..."});
    listener({status: "Delete Pods -  Deleting 1 of 3..."});

    await Helpers.spawn(
      `${prefix} && rm -rfv ./Pods`, 
      listener
    );

    listener({status: "Delete Pods - Deleting 2 of 3..."});
    await Helpers.spawn(
      `${prefix} && rm -rfv ./Podfile.lock`, 
      listener
    );

    listener({status: "Delete Pods - Deleting 3 of 3..."});

    if(skipDeletingWorkspace){
      listener({status: "Skip deleting: IosPopoverExample.xcworkspace"});

    } else {
      await Helpers.spawn(
        `${prefix} && rm -rfv ./`, 
        listener
      );
    };

    listener({status: "Example ios workspace project deleted."});
  };

  static async exampleDeleteNodeModules(listener){
    listener({status: "Deleting example node_modules..."});

    await Helpers.spawn(
      `cd example && rm -rfv ./node_modules`, 
      listener
    );

    listener({status: "Example node_modules deleted."});
  };

  static async exampleRemoveDependencies(listener){
    const prefix = "cd example/ios";

    listener({status: "Removing example dependencies..."});

    await Helpers.spawn(
      `${prefix} && yarn remove react-native-ios-utilities`, 
      listener
    );

    listener({status: "Example dependencies removed."});
  };

  // remove example dependencies + delete example workspace
  static async exampleNukeWorkspace(listener){
    //status, stdout, stderr

    listener({status: "Removing example dependencies + pods/xcworkspace..."});

    await Scripts.exampleRemoveDependencies(listener);
    await Scripts.exampleDeleteWorkspace(listener);
  };

  static async exampleInstallPods(listener){
    listener({status: "Begin installing example pods..."});
    
    await Helpers.spawn(
      `cd example/ios && pod install`, 
      listener
    );

    listener({status: "Example pods installed."});
  };

  // install example local package dep. - no pods
  static async exampleInstallDepLocal(listener){
    const prefix = "cd example";
    
    listener({status: "Installing example local dependencies..."});

    await Helpers.spawn(
      `echo 'Library - Local Install: react-native-ios-utilities' && echo "DIR: $REACT_NATIVE_IOS_UTILITIES_DIR"`, 
      listener
    );

    await Helpers.spawn(
      `${prefix} && yarn add --dev $REACT_NATIVE_IOS_UTILITIES_DIR`, 
      listener
    );

    listener({status: "react-native-ios-utilities local example install complete."});
  };

  // install latest example package dep. via NPM - no pods
  static async exampleInstallDepProduction(listener){
    listener({status: "Installing latest example dependencies via NPM"});
    
    await Helpers.spawn(
      `cd example && yarn add react-native-ios-utilities`, 
      listener
    );

    listener({status: "react-native-ios-utilities example install complete."});
  };

  // install example local dep. + pods w/o resetting
  static async exampleUseDepLocalSoft(listener){
    listener({status: "Installing example local dependencies + pods..."});
    
    await Scripts.exampleInstallDepLocal(listener);
    await Scripts.exampleInstallPods(listener);
  };

  // nuke xcworkspace then install example local dep. + pods
  static async exampleUseDepLocalHard(listener){
    listener({status: "Resetting example project + install local dep + pod install..."});
    
    await Scripts.exampleNukeWorkspace(listener);
    await Scripts.exampleInstallDepLocal(listener);
    await Scripts.exampleInstallPods(listener);
  };

  // install example package dep. prod. + pod install
  static async exampleUseDepProductionSoft(listener){
    listener({status: "Install dep. production + pod install..."});

    await Scripts.exampleInstallDepProduction(listener);
    await Scripts.exampleInstallPods(listener);
  };

  // nuke example xcworkspace + install package dep. prod. + pod install
  static async exampleUseDepProductionHard(listener){
    listener({status: "Install dep. production + pod install..."});

    await Scripts.exampleNukeWorkspace(listener);
    await Scripts.exampleInstallDepProduction(listener);
    await Scripts.exampleInstallPods(listener);
  };

  static async libraryUseDepLocalSoft(listener){
    listener({status: "Install library dep. locally..."});

    await Helpers.spawn(
      `echo 'Library - Local Install: react-native-ios-utilities' && echo "DIR: $REACT_NATIVE_IOS_UTILITIES_DIR"`, 
      listener
    );

    await Helpers.spawn(
      `yarn add --dev $REACT_NATIVE_IOS_UTILITIES_DIR`, 
      listener
    );
  };

  // soft install dep. for lib. + example
  static async useDependencyLocalSoft(listener){
    listener({status: "Installing library + example dependencies locally w/o resetting..."});

    await Scripts.refreshLocalLibraries();
    await Scripts.libraryUseDepLocalSoft();
    await Scripts.exampleUseDepLocalSoft();
  };
};

// Organized into routes/pages/screen
// Only one page is visible at a given time, i.e. hide/show
class RootElements {

  // keep track of which "page" is currently active/visible
  static currentActivePage = null;

  static screen = blessed.screen({
    smartCSR: true,
    title: 'utility scripts'
  });

  static pageChooseScriptForm = blessed.form({
    parent: RootElements.screen,
    width: '100%',
    keys: true,
    padding: {
      left: 1,
      right: 1,
    },
  });

  static pageScriptOutputBox = blessed.box({
    parent: RootElements.screen,
    width: '100%',
    hidden: true,
    
    left: 0,
    top: 1,  
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
  });
};

class ChooseScriptPage {
  static radioSetScriptChoice = blessed.radioset({
    parent: RootElements.pageChooseScriptForm,
    width: '100%',
    top: 2
  });

  static getSelectedScriptChoiceKey(data = {}, choices = []){
    // { scriptChoice: [ true, false, false, false ] }
    const scriptChoiceRaw = (data ?? {})[ID_KEYS.scriptChoice] ?? [];

    // [ true, false, false, false ]
    // [ true, false, false ]
    // [ true, false ]
    // true
    const scriptChoiceArrayRaw = Array.isArray(scriptChoiceRaw)
      ? scriptChoiceRaw
      : [scriptChoiceRaw];

    const scriptChoiceArray = (() => {
      const dataCount   = scriptChoiceArrayRaw.length;
      const targetCount = choices.length;
      const diffCount   = targetCount - dataCount;

      if(diffCount <= 0){
        return scriptChoiceArrayRaw;

      } else {
        let pre = [];

        for (let i = 0; i < (diffCount - 2); i++) {
          pre.push(false);
        };

        return [...pre, ...scriptChoiceArrayRaw];
      };
      
    })();

    const choicesFiltered = RADIO_CHOICES.filter(item =>
      item.type === RADIO_CHOICES_TYPES.choice
    );

    // i.e. `[false, false, true...]`
    const selectedIndex = scriptChoiceArray.findIndex(item => item);
    
    const choiceKey = ((selectedIndex === -1)
      ? null
      : choicesFiltered[selectedIndex]?.key ?? null
    );

    (false && console.log('\n DEBUG', 
      '\n - scriptChoiceRaw:', scriptChoiceRaw,  
      '\n - scriptChoiceArrayRaw', scriptChoiceArrayRaw, 
      '\n - scriptChoiceArray', scriptChoiceArray,
      `\n - selectedIndex: ${selectedIndex}`,
      `\n - choices[selectedIndex]: ${JSON.stringify(choices[selectedIndex])}`,
      `\n - choiceKey: ${choiceKey}`
    ));

    return choiceKey;
  };

  static render(){
    const { radioSetScriptChoice } = ChooseScriptPage;
    let topCounter = 0;

    // remove falsy values
    const choicesFiltered = RADIO_CHOICES ; RADIO_CHOICES.filter(item => !!item);

    // render choices
    choicesFiltered.forEach((item, index) => {
      switch (item.type) {
        case RADIO_CHOICES_TYPES.choice:
          blessed.radiobutton({
            parent: radioSetScriptChoice,
            name: ID_KEYS.scriptChoice,
            content: item.title,

            top: topCounter++,
            style: {
              bold: true,
            },
          });

          blessed.text({
            parent: radioSetScriptChoice,
            content: item.subtitle,

            top: topCounter++,
            left: 4,
            style: {
              fg: 'grey',
            },
          });

          topCounter++;
          break;

        case RADIO_CHOICES_TYPES.spacer:
          const spaceAmount = item.spaceAmount ?? 1;
          topCounter +=spaceAmount;
          break;
      
        default:
          break;
      }
    });

    // listen for form submit event
    RootElements.pageChooseScriptForm.on('submit', data => {
      const selectedScriptChoiceKey = 
        ChooseScriptPage.getSelectedScriptChoiceKey(data, choicesFiltered);

      if(selectedScriptChoiceKey != null){
        // A - Item was selected...
        // "navigate" to `scriptOutput` page
        RootElements.pageChooseScriptForm.destroy();
        RootElements.pageScriptOutputBox.show();
        RootElements.currentActivePage = PAGE_KEYS.scriptOutput;
        RootElements.screen.cursorReset();

        ScriptOutputPage.render({
          choiceKey: selectedScriptChoiceKey
        });

      } else {
        // B - Nothing was selected...
        RootElements.screen.destroy();
        process.exit(1);
      };
    });

    // listen for "enter" keypress
    RootElements.screen.key('enter', function () {
      const isActive = 
        RootElements.currentActivePage === PAGE_KEYS.chooseScriptForm;

      if(isActive){
        RootElements.pageChooseScriptForm.submit();
      };
    });
  };
};

class ScriptOutputPage {
  static CONSTANTS = {
    topStatusHeight: 6,
  };

  static topStatus = blessed.text({
    parent: RootElements.pageScriptOutputBox,
    width: '100%',
    height: ScriptOutputPage.CONSTANTS.topStatusHeight,
    align: 'left',
    border: {
      type: "line"
    },
    padding: {
      left: 1,
      right: 1,
    },

    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    scrollbar: true,
    tag: true,
  });

  static bottomLog = blessed.text({
    parent: RootElements.pageScriptOutputBox,
    width: '100%',
    top: ScriptOutputPage.CONSTANTS.topStatusHeight + 1,
    align: 'left',
    border: {
      type: "line"
    },
    padding: {
      left: 1,
      right: 1,
    },

    scrollable: true,
    alwaysScroll: true,
    scrollbar: true,
    mouse: true,
    tag: true,
  });

  static logStatus(message){
    const { screen } = RootElements;
    const { topStatus } = ScriptOutputPage;
    if(message == null) return;

    topStatus.pushLine(`${message}`);
    topStatus.scroll(Number.MAX_VALUE);
    
    screen.render();
  };

  static logOutput(message){
    const { screen } = RootElements;
    const { bottomLog } = ScriptOutputPage;
    if(message == null) return;

    bottomLog.pushLine(`${message}`);
    bottomLog.scroll(Number.MAX_VALUE);

    screen.render();
  };

  static logError(message){
    const { screen } = RootElements;
    const { bottomLog } = ScriptOutputPage;
    if(message == null) return;

    bottomLog.pushLine(`\x1b[${message}\x1b[0m`);

    bottomLog.scroll(Number.MAX_VALUE);
    screen.render();
  };

  static log({status, stdout, stderr}){
    ScriptOutputPage.logStatus(status);
    ScriptOutputPage.logOutput(stdout);
    ScriptOutputPage.logError (stderr);
  };

  static async render(props = {
    choiceKey: null,
  }){
    const { screen } = RootElements;
    const { topStatus, bottomLog } = ScriptOutputPage;

    topStatus.pushLine(`Choice: ${props.choiceKey}`);

    // run script based on "script choice key"
    switch (props.choiceKey) {
      case SCRIPT_CHOICE_KEYS.exampleLocalDepInstallSoft:
        await Scripts.exampleUseDepLocalSoft((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.exampleLocalDepInstallHard:
        await Scripts.exampleUseDepLocalHard((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.libraryLocalDepInstallSoft:
        await Scripts.libraryUseDepLocalSoft((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.localDepInstallSoft:
        await Scripts.useDependencyLocalSoft((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case 'test':
        // debug
        await Scripts.testHelloWorld(({status, stdout, stderr}) => {
          if(status){
            topStatus.pushLine(`status: ${status}`);
            topStatus.scroll(Number.MAX_VALUE);
          };

          if(stdout){
            bottomLog.pushLine(`${stdout}`);
            bottomLog.scroll(Number.MAX_VALUE);
          };

          if(stderr){
            //console.log(`stderr: ${stderr}`);
            bottomLog.pushLine(`${stdout}`);
            bottomLog.scroll(Number.MAX_VALUE);
          };

          screen.render();
        });
        break;

      default:
        break;
    };

    ScriptOutputPage.logStatus('Script Finished - Press Q to quit');
    ScriptOutputPage.logStatus('Bye b\n');
    topStatus.scroll(Number.MAX_VALUE);
  };
};


class Lifecycle {
  static init(){
    const { screen } = RootElements;

    child_process.exec('echo $REACT_NATIVE_IOS_UTILITIES_DIR', (_, stdout) => {
      DEPENDENCIES_DICT.reactNativeIosUtilities.localDIR = stdout;
    });

    screen.key('q', function () {
      this.destroy();
      process.exit(0);
    });
  };

  static render(){
    Lifecycle.init();

    RootElements.currentActivePage = PAGE_KEYS.chooseScriptForm;

    ChooseScriptPage.render();
    RootElements.screen.render();
  };
};

// start
Lifecycle.render();