#!/usr/bin/env node
import { Command } from 'commander';
import * as packageJSON from '../../package.json';
import { TokenType } from '../common/token-type.enum';
import { getPortfolio } from '../services/portfolio.service';

const program = new Command();

program
    .version(packageJSON.version)
    .option(
        '-T --token <string>',
        'Specified token name [BTC, ETH, XRP]'
    )
    .option(
        '-D --date <string>',
        'Specifies transaction date in yyyy-mm-dd format'
    )
    .action(async function (options) {
        const tokenTypes = Object.values(TokenType);

        if (options.token && !tokenTypes.includes(options.token)) {
            console.warn('Invalid token type');

            process.exit();
        }
        const portfolio = await getPortfolio(options?.token, options?.date);

        console.log(portfolio);

        process.exit();
    })
    .parse(process.argv);
