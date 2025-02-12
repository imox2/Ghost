const should = require('should');
const _ = require('lodash');
const crypto = require('crypto');
const schema = require('../../../../core/server/data/schema');
const fixtures = require('../../../../core/server/data/schema/fixtures');
const defaultSettings = require('../../../../core/server/data/schema/default-settings');

/**
 * @NOTE
 *
 * If this test fails for you, you have modified the database schema or fixtures or default settings.
 * When you make a change, please test that:
 *
 * 1. A new blog get's installed and the database looks correct and complete.
 * 2. A blog get's updated from a lower Ghost version and the database looks correct and complete.
 *
 * Typical cases:
 * You have to add a migration script if you've added/modified permissions.
 * You have to add a migration script if you've add a new table.
 * You have to add a migration script if you've added new settings to populate group/flags column.
 */
describe('DB version integrity', function () {
    // Only these variables should need updating
    const currentSchemaHash = '42a966364eb4b5851e807133374821da';
    const currentFixturesHash = '29148c40dfaf4f828c5fca95666f6545';
    const currentSettingsHash = 'a079e294592f6effe0738e671d053e20';

    // If this test is failing, then it is likely a change has been made that requires a DB version bump,
    // and the values above will need updating as confirmation
    it('should not change without fixing this test', function () {
        const tablesNoValidation = _.cloneDeep(schema.tables);
        let schemaHash;
        let fixturesHash;
        let settingsHash;

        _.each(tablesNoValidation, function (table) {
            return _.each(table, function (column, name) {
                table[name] = _.omit(column, 'validations');
            });
        });

        schemaHash = crypto.createHash('md5').update(JSON.stringify(tablesNoValidation), 'binary').digest('hex');
        fixturesHash = crypto.createHash('md5').update(JSON.stringify(fixtures), 'binary').digest('hex');
        settingsHash = crypto.createHash('md5').update(JSON.stringify(defaultSettings), 'binary').digest('hex');

        schemaHash.should.eql(currentSchemaHash);
        fixturesHash.should.eql(currentFixturesHash);
        settingsHash.should.eql(currentSettingsHash);
    });
});
