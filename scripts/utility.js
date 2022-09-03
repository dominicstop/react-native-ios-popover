/* eslint-disable react-hooks/rules-of-hooks */
const path = require('path');
const child_process = require('child_process');

const blessed = require('blessed');


// #region - Constants 
// -------------------

const SHARED = {
  didTriggeRefreshLocalLibraries: false,

  // @latest / @next / @version / etc..
  prodVersion: 'next',
};

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
  exampleUseDepLocalSoft: 'exampleUseDepLocalSoft',
  exampleUseDepLocalHard: 'exampleUseDepLocalHard',
  exampleUseDepProductionSoft : 'exampleUseDepProductionSoft' ,
  exampleUseDepProductionHard : 'exampleUseDepProductionHard' ,

  libraryUseDepLocalSoft: 'libraryUseDepLocalSoft',
  libraryUseDepLocalHard: 'libraryUseDepLocalHard',
  libraryUseDepProductionSoft : 'libraryUseDepProductionSoft' ,
  libraryUseDepProductionHard : 'libraryUseDepProductionHard' ,

  useDependencyLocalSoft: 'useDependencyLocalSoft',
  useDependencyLocalHard: 'useDependencyLocalHard',
  useDependencyProductionSoft : 'useDependencyProductionSoft' ,
  useDependencyProductionHard : 'useDependencyProductionHard' ,
};

const RADIO_CHOICES_TYPES = {
  choice: 'choice',
  spacer: 'spacer',
  header: 'header',
};

const RADIO_CHOICES = [{
  type: RADIO_CHOICES_TYPES.header,
  title: 'Example-Related',
  spaceAmount: 1,

}, {
  title: "Example - Local Install - Dep. - Soft ",
  subtitle: "Install example package dependencies w/o resetting",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.exampleUseDepLocalSoft,

}, {
  title: "Example - Local Install - Dep. - Hard ",
  subtitle: "Clean install example package dependencies - Hard Reset",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.exampleUseDepLocalHard,

}, {
  title: "Example - NPM Install - Dep. - Soft ",
  subtitle: `Install example package dependencies via NPM (${SHARED.prodVersion})`,
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.exampleUseDepProductionSoft,

}, {
  title: "Example - NPM Install - Dep. - Hard ",
  subtitle: `Clean install ex. pkg dep. via NPM (${SHARED.prodVersion}) - Hard Reset`,
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.exampleUseDepProductionHard,
  
}, {
  type: RADIO_CHOICES_TYPES.spacer,
  spaceAmount: 1,

}, {
  type: RADIO_CHOICES_TYPES.header,
  title: 'Library-Related',
  spaceAmount: 1,

}, {
  title: "Library - Local Install - Dep. - Soft ",
  subtitle: "Install library dev. dependencies w/o resetting",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.libraryUseDepLocalSoft,

}, {
  title: "Library - Local Install - Dep. - Hard ",
  subtitle: "Hard Reset + Install library dev. dependencies",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.libraryUseDepLocalHard,

}, {
  title: "Library - NPM Install - Dep. - Soft ",
  subtitle: `Install library package dependencies via NPM (${SHARED.prodVersion})`,
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.libraryUseDepProductionSoft,

}, {
  title: "Library - NPM Install - Dep. - Hard ",
  subtitle: `Clean install lib pkg dep. via NPM (${SHARED.prodVersion}) - Hard Reset`,
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.libraryUseDepProductionHard,

}, {
  type: RADIO_CHOICES_TYPES.spacer,
  spaceAmount: 1,

}, {
  type: RADIO_CHOICES_TYPES.header,
  title: '"Example + Library"-Related',
  spaceAmount: 1,

}, {
  title: "Local Install - Dep. - Soft ",
  subtitle: "Install library dev. dep. + example dep. w/o resetting",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.useDependencyLocalSoft,

}, {
  title: "Local Install - Dep. - Hard ",
  subtitle: "Hard Reset + Install library dev. dep. + example dep.",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.useDependencyLocalHard,

}, {
  title: "NPM Install - Dep. - Soft ",
  subtitle: "Install lib. dev. dep. + ex. dep. via NPM w/o resetting",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.useDependencyProductionSoft,
}, {
  title: "NPM Install - Dep. - Hard ",
  subtitle: "Hard install lib. dev. dep. + ex. dep. via NPM - Hard reset",
  type: RADIO_CHOICES_TYPES.choice,
  key: SCRIPT_CHOICE_KEYS.useDependencyProductionHard,
}];

const CONFIG_FLAGS = {
  skipDeleteExampleXCWorkspace: true,
  skipDeleteExampleNodeModules: true,
  skipDeleteExampleLockFile: true,

  skipDeleteLibraryNodeModules: true,
  skipDeleteLibraryLockFile: true,
};

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

class BaseScripts {

  static async refreshLocalLibraries(listener){
    // guard check
    if(SHARED.didTriggeRefreshLocalLibraries){
      listener({status: "local libraries already refreshed, skipping..."});
      return;
    };

    listener({status: "Refreshing local libraries...."});

    await Helpers.spawn(
      `echo 'Refresh Library - react-native-ios-utilities' && echo "DIR: $REACT_NATIVE_IOS_UTILITIES_DIR"`, 
      listener
    );

    await Helpers.spawn(
      `cd $REACT_NATIVE_IOS_UTILITIES_DIR && yarn run bob build`, 
      listener
    );

    SHARED.didTriggeRefreshLocalLibraries = true;
  };

  // ---------------------------------------

  static async exampleOpenXcode(listener){
    listener({status: "Opening example xcworkspace..."});

    await Helpers.spawn(
      `open ./example/ios/IosPopoverExample.xcworkspace`, 
      listener
    );
  }; 

  static async exampleDeleteWorkspace(listener){
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

    if(CONFIG_FLAGS.skipDeleteExampleXCWorkspace){
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
    const prefix = 'cd example &&';

    // guard check
    if(CONFIG_FLAGS.skipDeleteExampleNodeModules){
      listener({status: "Skip: Delete example node_modules..."});
      return;
    };

    listener({status: "Deleting example node_modules - 1/2..."});

    await Helpers.spawn(
      `${prefix} rm -rfv ./node_modules`, 
      listener
    );

    listener({status: "Deleting example node_modules - 2/2..."});
    
    if(CONFIG_FLAGS.skipDeleteLibraryLockFile){
      listener({status: "Skip - delete example lockfile"});

    } else {
      await Helpers.spawn(
        `${prefix} rm -rfv ./yarn.lock`, 
        listener
      );
    };

    listener({status: "Example node_modules deleted."});
  };

  static async exampleInstallNodeModules(listener){
    listener({status: "Installing example node_modules..."});

    await Helpers.spawn(
      `cd example && yarn`, 
      listener
    );

    listener({status: "Example node_modules installed."});
  };

  static async exampleUninstallDependencies(listener){
    const prefix = "cd example/ios";

    listener({status: "Uninstalling example dependencies..."});

    await Helpers.spawn(
      `${prefix} && yarn remove react-native-ios-utilities`, 
      listener
    );

    listener({status: "Example dependencies removed."});
  };

  static async exampleInstallPods(listener){
    listener({status: "Begin installing example pods..."});
    
    await Helpers.spawn(
      `cd example/ios && pod install`, 
      listener
    );

    listener({status: "Example pods installed."});
  };

  // install example local package dep.
  // Note: Does not trigger pod install by itself
  static async exampleInstallDepLocal(listener){
    const prefix = "cd example";
    
    // refresh local lib. if needed
    await BaseScripts.refreshLocalLibraries(listener);

    listener({status: "Installing example local dependencies..."});
    await Helpers.spawn(
      `echo 'Library - Local Install: react-native-ios-utilities' && echo "DIR: $REACT_NATIVE_IOS_UTILITIES_DIR"`, 
      listener
    );

    await Helpers.spawn(
      `${prefix} && yarn add $REACT_NATIVE_IOS_UTILITIES_DIR`, 
      listener
    );

    listener({status: "react-native-ios-utilities local example install complete."});
  };

  // install latest example package dep. via NPM
  // Note: Does not trigger pod install by itself
  static async exampleInstallDepProduction(listener){
    listener({status: 
        `Installing latest example dependencies (${SHARED.prodVersion}) `
      + "via NPM"
    });
    
    await Helpers.spawn(
      `cd example && yarn add react-native-ios-utilities@${SHARED.prodVersion}`, 
      listener
    );

    listener({status: 
      `Latest example dependencies (${SHARED.prodVersion}) installed via NPM`
    });
  };

  // ---------------------------------------

  static async libraryDeleteNodeModules(listener){
    // guard check
    if(CONFIG_FLAGS.skipDeleteLibraryNodeModules){
      listener({status: "Skip: Delete library node_modules..."});
      return;
    };

    listener({status: "Deleting library node_modules - 1/2..."});
    await Helpers.spawn(`rm -rfv ./node_modules`, listener);

    listener({status: "Deleting library node_modules - 2/2..."});
    
    if(CONFIG_FLAGS.skipDeleteLibraryLockFile){
      listener({status: "Skip - delete library lockfile"});

    } else {
      await Helpers.spawn(`rm -rfv ./yarn.lock`, listener);
    };

    listener({status: "Library node_modules deleted."});
  };

  static async libraryInstallNodeModules(listener){
    listener({status: "Installing library node_modules..."});
    await Helpers.spawn(`yarn`, listener);

    listener({status: "library node_modules installed."});
  };

  static async libraryUninstallDependencies(listener){
    listener({status: "Uninstalling library dependencies..."});
    await Helpers.spawn(
      `yarn remove react-native-ios-utilities`, 
      listener
    );

    listener({status: "library dependencies removed."});
  };

  static async libraryBobBuild(listener){
    listener({status:`Running 'bob build' in library...`});
    await Helpers.spawn(`yarn run bob build`, listener);

    listener({status:`library 'bob build' complete...`});
  };

  static async libraryInstallDepLocal(listener){
    await BaseScripts.refreshLocalLibraries(listener);

    listener({status: "Install library dep. locally..."});
    await Helpers.spawn(
      `echo 'Library - Local Install: react-native-ios-utilities' && echo "DIR: $REACT_NATIVE_IOS_UTILITIES_DIR"`, 
      listener
    );

    await Helpers.spawn(
      `yarn add --dev $REACT_NATIVE_IOS_UTILITIES_DIR`, 
      listener
    );

    listener({status: "library dep. installed locally."});
  };

  // install latest example package dep. via NPM
  static async libraryInstallDepProduction(listener){
    listener({status: 
        `Installing latest library dependencies (${SHARED.prodVersion}) `
      + "via NPM"
    });

    await Helpers.spawn(
      `yarn add react-native-ios-utilities@${SHARED.prodVersion}`, 
      listener
    );

    listener({status: 
      `Latest library dependencies (${SHARED.prodVersion}) installed via NPM`
    });
  };
};

// compound scripts
class CompScripts {

  static async exampleResetNodeModules(listener){
    // guard check
    if(CONFIG_FLAGS.skipDeleteExampleNodeModules){
      listener({status: "Skip: Reset example node_modules..."});
      return;
    };

    listener({status: "Resetting example node_modules..."});

    await BaseScripts.exampleDeleteNodeModules(listener);
    await BaseScripts.exampleInstallNodeModules(listener);

    listener({status: "Example node_modules reset."});
  };

  // ---------------------------------------

  static async libraryResetNodeModules(listener){
    // guard check
    if(CONFIG_FLAGS.skipDeleteLibraryNodeModules){
      listener({status: "Skip: Reset library node_modules..."});
      return;
    };

    await BaseScripts.libraryDeleteNodeModules(listener);
    await BaseScripts.exampleInstallNodeModules(listener);


    listener({status: "Library node_modules reset."});
  };
};


class MainScripts {

  static async testHelloWorld(listener){
    listener({status: "Testing... Hello world"});
    await Helpers.spawn(`echo "Hello World from terminal via echo..."`, listener);

    listener({status: "Testing... 1"});
    await Helpers.spawn(`echo "ls -l"`, listener);
    await Helpers.spawn(`node --version`, listener);

    listener({status: "Testing... 2"});
    await Helpers.spawn(`npm --version`, listener);

    listener({status: "Testing... 2.1"});
    await Helpers.spawn(`pod --version`, listener);

    listener({status: "Testing... 2.2"});
    await Helpers.spawn(`yarn --version`, listener);

    listener({status: "Testing... 3"});
    await Helpers.spawn(`cal`, listener);

    listener({status: "Testing... 4"});
    await Helpers.spawn(
      `cd example && ls && cd ios && ls && cd Pods && ls`, 
      listener
    );

    listener({status: "Test complete."});
  };

  // ---------------------------------------

  // install example local dep. + pods w/o resetting
  static async exampleUseDepLocalSoft(listener){
    listener({status: "Installing example local dependencies + pods..."});
    
    await BaseScripts.exampleInstallDepLocal(listener);
    await BaseScripts.exampleInstallPods(listener);

    listener({status: "example local dependencies + pods installed..."});
  };

  // delete xcworkspace then install example local dep. + pods
  static async exampleUseDepLocalHard(listener){
    listener({status: 
        "Begin Resetting example project + install example local  "
      + "dependencies + install example pods..."
    });
    
    await BaseScripts.exampleDeleteWorkspace(listener);
    await BaseScripts.exampleUninstallDependencies(listener);
    await CompScripts.exampleResetNodeModules(listener);
    await BaseScripts.exampleInstallDepLocal(listener);
    await BaseScripts.exampleInstallPods(listener);

    listener({status: 
        "Example project reset + example local dependencies "
      + " installed + example pods installed."
    });
  };

  // install example package dep. prod. + pod install
  static async exampleUseDepProductionSoft(listener){
    listener({status: 
        `Install example dependency latest (${SHARED.prodVersion}) via NPM `
      + "+ install example pods"
    });

    await BaseScripts.exampleInstallDepProduction(listener);
    await BaseScripts.exampleInstallPods(listener);

    listener({status: 
        `Example dependency latest (${SHARED.prodVersion}) installed via NPM `
      + "+ installed example pods"
    });
  };

  static async exampleUseDepProductionHard(listener){
    listener({status: 
        "Begin Resetting example project + install example latest "
      + `dependencies (${SHARED.prodVersion}) + install example pods`
    });

    await BaseScripts.exampleDeleteWorkspace(listener);
    await BaseScripts.exampleUninstallDependencies(listener);
    await CompScripts.exampleResetNodeModules(listener);
    await BaseScripts.exampleInstallDepProduction(listener);
    await BaseScripts.exampleInstallPods(listener);

    listener({status: 
        "Example project reset + example latest dependencies"
      + `(${SHARED.prodVersion}) installed + example pods installed.`
    });
  };

  // ---------------------------------------

  static async libraryUseDepLocalSoft(listener){
    listener({status: "Use local dep. for library..."});
    await BaseScripts.libraryInstallDepLocal(listener);
    await BaseScripts.libraryBobBuild(listener);

    listener({status: "Library is now using local deps."});
  };

  static async libraryUseDepLocalHard(listener){
    listener({status: 
        "Begin Resetting library node_modules + install local "
      + `library dependencies...`
    });

    await BaseScripts.libraryUninstallDependencies(listener);
    await CompScripts.libraryResetNodeModules(listener);
    await BaseScripts.libraryInstallDepLocal(listener);
    await BaseScripts.libraryBobBuild(listener);

    listener({status: 
        "Library node_modules reset + library example local "
      + `dependencies installed.`
    });
  };

  static async libraryUseDepProductionSoft(listener){
    listener({status: 
        `Install library dependency latest (${SHARED.prodVersion}) `
      + `via NPM`
    });

    await BaseScripts.libraryInstallDepProduction(listener);
    await BaseScripts.libraryBobBuild(listener);

    listener({status: 
        `Library dependency latest (${SHARED.prodVersion}) installed `
      + "via NPM"
    });
  };

  static async libraryUseDepProductionHard(listener){
    listener({status: 
        "Begin Resetting library node_modules + install library latest "
      + `dependencies (${SHARED.prodVersion})`
    });

    await BaseScripts.libraryUninstallDependencies(listener);
    await CompScripts.libraryResetNodeModules(listener);
    await BaseScripts.libraryInstallDepProduction(listener);
    await BaseScripts.libraryBobBuild(listener);

    listener({status: 
        "Library node_modules reset + library example latest dependencies"
      + `(${SHARED.prodVersion}) installed.`
    });
  };

  // ---------------------------------------

  // soft install dependency for library + example
  static async useDependencyLocalSoft(listener){
    listener({status: 
      "Installing library + example dependencies locally w/o resetting..."
    });

    await BaseScripts.refreshLocalLibraries(listener);
    await MainScripts.libraryUseDepLocalSoft(listener);
    await MainScripts.exampleUseDepLocalSoft(listener);

    listener({status: 
      "Library + example dependencies installed locally w/o resetting..."
    });
  };

  // hard install dependency for library + example
  static async useDependencyLocalHard(listener){
    listener({status: 
        "Reset library + example, then install library + example "
      + "dependency locally..."
    });

    await BaseScripts.refreshLocalLibraries(listener);
    await MainScripts.exampleUseDepLocalHard(listener);
    await MainScripts.libraryUseDepLocalHard(listener);

    listener({status: 
        "Library + example reset, and library + example dependency "
      + "installed locally..."
    });
  };

  static async useDependencyProductionSoft(listener){
    listener({status: 
      "Installing library + example dependencies via NPM w/o resetting..."
    });

    await BaseScripts.refreshLocalLibraries(listener);
    await MainScripts.libraryUseDepProductionSoft(listener);
    await MainScripts.exampleUseDepProductionSoft(listener);

    listener({status: 
      "Library + example dependencies installed via NPM w/o resetting..."
    });
  };

  static async useDependencyProductionHard(listener){
    listener({status: 
        "Reset library + example, then install library + example "
      + `dependency via NPM (${SHARED.prodVersion})...`
    });

    await BaseScripts.refreshLocalLibraries(listener);
    await MainScripts.exampleUseDepLocalHard(listener);
    await MainScripts.libraryUseDepLocalHard(listener);

    listener({status: 
        "Library + example reset, and library + example dependency "
      + `installed via NPM (${SHARED.prodVersion})...`
    });
  };
};

// Organized into routes/pages/screen
// Only one page is visible at a given time, i.e. hide/show
class RootElements {

  // keep track of which "page" is currently active/visible
  static currentActivePage = null;

  static screen = blessed.screen({
    smartCSR: true,
    title: 'utility scripts',
  });

  static pageChooseScriptForm = blessed.form({
    parent: RootElements.screen,
    width: '100%',
    padding: {
      left: 1,
      right: 1,
    },
    keys: true,
    tags: true,
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
    tags: true,
  });
};

class ChooseScriptPage {
  static enableDebug = false;

  static radioSetScriptChoice = blessed.radioset({
    parent: RootElements.pageChooseScriptForm,
    width: '100%',
    top: 2
  });

  static getSelectedScriptChoiceKey(data = {}, choices = []){
    const choicesFiltered = RADIO_CHOICES.filter(item =>
      item.type === RADIO_CHOICES_TYPES.choice
    );

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
      const targetCount = choicesFiltered.length;
      const diffCount   = targetCount - dataCount;

      if(diffCount <= 0){
        return scriptChoiceArrayRaw;

      } else {
        let pre = [];

        for (let i = 0; i < (diffCount); i++) {
          pre.push(false);
        };

        return [...pre, ...scriptChoiceArrayRaw];
      };
      
    })();

    // i.e. `[false, false, true...]`
    const selectedIndex = scriptChoiceArray.findIndex(item => item);
    
    const choiceKey = ((selectedIndex === -1)
      ? null
      : choicesFiltered[selectedIndex]?.key ?? null
    );

    (ChooseScriptPage.enableDebug && console.log(
      '\n DEBUG', 
      '\n - scriptChoiceRaw:', scriptChoiceRaw,  
      '\n - scriptChoiceArrayRaw', scriptChoiceArrayRaw, 
      '\n - scriptChoiceArray', scriptChoiceArray,
      `\n - selectedIndex: ${selectedIndex}`,
      `\n - choicesFiltered[selectedIndex]: ${JSON.stringify(choicesFiltered[selectedIndex])}`,
      `\n - choiceKey: ${choiceKey}`,
      `\n\n - data:\n${JSON.stringify(data)}`,
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

        case RADIO_CHOICES_TYPES.header:
          blessed.text({
            parent: radioSetScriptChoice,
            content: item.title,

            top: topCounter++,
            left: 0,
            style: {
              underline: true,
              bold: true,
            },
          });

          topCounter += item.spaceAmount ?? 0;
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
        if(ChooseScriptPage.enableDebug) return;

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
        if(!ChooseScriptPage.enableDebug) return;

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
      case SCRIPT_CHOICE_KEYS.exampleUseDepLocalSoft:
        await MainScripts.exampleUseDepLocalSoft((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.exampleUseDepLocalHard:
        await MainScripts.exampleUseDepLocalHard((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.exampleUseDepProductionSoft:
        await MainScripts.exampleUseDepProductionSoft((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.exampleUseDepProductionHard:
        await MainScripts.exampleUseDepProductionHard((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      // ------------------------------

      case SCRIPT_CHOICE_KEYS.libraryUseDepLocalSoft:
        await MainScripts.libraryUseDepLocalSoft((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.libraryUseDepLocalHard:
        await MainScripts.libraryUseDepLocalHard((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.libraryUseDepProductionSoft:
        await MainScripts.libraryUseDepProductionSoft((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.libraryUseDepProductionHard:
        await MainScripts.libraryUseDepProductionHard((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      // ------------------------------

      case SCRIPT_CHOICE_KEYS.useDependencyLocalSoft:
        await MainScripts.useDependencyLocalSoft((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.useDependencyLocalHard:
        await MainScripts.useDependencyLocalHard((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.useDependencyProductionSoft:
        await MainScripts.useDependencyProductionSoft((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      case SCRIPT_CHOICE_KEYS.useDependencyProductionHard:
        await MainScripts.useDependencyProductionHard((output) => {
          ScriptOutputPage.log(output);
        });
        break;

      // ------------------------------
      
      case 'test':
        ScriptOutputPage.logStatus(
          'Choice not implemented, running test script instead...'
        );

        // debug
        await MainScripts.testHelloWorld(({status, stdout, stderr}) => {
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
    ScriptOutputPage.logStatus('Bye b xx\n');
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