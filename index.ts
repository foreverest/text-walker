import { TextWalker } from './text-walker';
let text = `
apply plugin: 'com.android.application'

android {
    compileSdkVersion 25
    buildToolsVersion "25.0.2"
  
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    androidTestCompile('com.android.support.test.espresso:espresso-core:2.2.2', {
        exclude group: 'com.android.support', module: 'support-annotations'
    })
    compile 'com.android.support:appcompat-v7:25.3.1'
    compile 'com.android.support.constraint:constraint-layout:1.0.2'
    testCompile 'junit:junit:4.12'
}`;

class State {
  bracesLevel: number;
}

let textWalker = new TextWalker<State>(text, new State());
textWalker.addTrap(
  tw => tw.prevChar == '{',
  tw => {
    tw.state.bracesLevel++;
  }
);

textWalker.addTrap(
  tw => tw.currentChar == '}',
  tw => {
    tw.state.bracesLevel--;
  }
);

textWalker.walk();