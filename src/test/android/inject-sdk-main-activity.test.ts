import { injectSdkMainActivity } from "../../android/inject-sdk-main-activity";

import * as assert from 'assert';
import * as fs from 'fs';

const appSecret = '00000000-0000-0000-0000-000000000000';

const importStatements = [
    'import com.microsoft.azure.mobile.MobileCenter;',
    'import com.microsoft.azure.mobile.analytics.Analytics;',
    'import com.microsoft.azure.mobile.crashes.Crashes;',
    'import com.microsoft.azure.mobile.distribute.Distribute;',
];

const startSdkStatements = [
    `MobileCenter.start(getApplication(), "${appSecret}",`,
    '        Analytics.class, Crashes.class, Distribute.class);'
];

const dir = __dirname + '/../../../src/test/android/examples/';
let files = fs.readdirSync(dir);
let correctExamples = files
    .filter(x => x.substr(-14) === '.original.java')
    .map(original_name => {
        let name = original_name.substr(0, original_name.length - 14);
        let expected_name = name + '.expected.java';
        return !fs.existsSync(dir + expected_name) ? null : {
            name,
            original: fs.readFileSync(dir + original_name, 'utf8'),
            expected: fs.readFileSync(dir + expected_name, 'utf8'),
        };
    })
    .filter(x => x);

let incorrectExamples = files
    .filter(x => x.substr(0, 9) === 'incorrect')
    .map(name => ({ name, code: fs.readFileSync(dir + name, 'utf8') }));

function normalize(text: string): string {
    while (~text.indexOf('\r\n'))
        text = text.replace('\r\n', '\n');
    return text;
}

describe('Main activity', function () {
    describe('Inject SDK positives', function () {
        correctExamples.forEach(function (example) {
            it(`should correctly inject SDK in the '${example.name}'`, function () {
                var result = injectSdkMainActivity(example.original, 'MainActivity', importStatements, startSdkStatements);
                assert.equal(normalize(result), normalize(example.expected));
            });
        });
    });
    describe('Inject SDK negatives', function () {
        incorrectExamples.forEach(function (example) {
            it(`should throw an error in the '${example.name}'`, function () {
                assert.throws(() => (injectSdkMainActivity(example.code, 'MainActivity', importStatements, startSdkStatements)));
            });
        });
    });
});


