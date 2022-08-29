#!/usr/bin/env node
import { Command } from 'commander';
import * as packageJSON from '../../package.json';
import { importAndProcess } from '../services/csv-importer.service';

const program = new Command();

program
    .version(packageJSON.version)
    .action(async function (options) {
        await importAndProcess();
    })
    .parse(process.argv);
