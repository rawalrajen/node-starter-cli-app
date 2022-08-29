
import { convertCryptoToUSD } from '../clients/cryptocompare.client';
import { TransactionType } from '../common/transaction-type.enum';
import { Transaction } from '../db'

const DIGITS_AFTER_DECIMAL = 6;

export const getPortfolio = async (token?: string, date?: string) => {

    if (token && date) {
        return getPortfolioValueByTokenAndDate(token, date);
    }

    if (token && !date) {
        return getPortfolioValueByToken(token);
    }

    if (!token && date) {
        return getPortfolioValueByDate(date);
    }

    return getAggregatePortfolioValue();
}

const getAggregatePortfolioValue = async () => {
    const aggregateSums = await Transaction.aggregate(
        [
            {
                $group: {
                    _id: {
                        type: '$transaction_type',
                        token: '$token'
                    },
                    total: {
                        $sum: "$amount"
                    }
                },

            },
            {
                $sort: { "_id.token": 1 }
            },
            {
                $project: {
                    _id: 0,
                    token: "$_id.token",
                    type: "$_id.type",
                    total: 1
                }
            },

        ]
    )

    return calculateBalance(aggregateSums);
}

const getPortfolioValueByToken = async (token: string) => {
    const aggregateSums = await Transaction.aggregate(
        [
            {
                $group: {
                    _id: {
                        type: '$transaction_type',
                        token: '$token'
                    },
                    total: {
                        $sum: "$amount"
                    }
                },
            },
            {
                $match: { "_id.token": token }
            },
            {
                $project: {
                    _id: 0,
                    token: "$_id.token",
                    type: "$_id.type",
                    total: 1
                }
            },
        ]
    );

    return calculateBalance(aggregateSums);
}

const getPortfolioValueByDate = async (date: string) => {
    const aggregateSums = await Transaction.aggregate(
        [
            {
                $group: {
                    _id: {
                        type: '$transaction_type',
                        token: '$token',
                        transaction_date: '$transaction_date'
                    },
                    total: {
                        $sum: "$amount"
                    }
                },
            },
            {
                $match: { "_id.transaction_date": date }
            },
            {
                $project: {
                    _id: 0,
                    token: "$_id.token",
                    type: "$_id.type",
                    date: "$_id.date",
                    total: 1
                }
            },

            {
                $sort: { "_id.token": 1 }
            },
        ]
    );

    return calculateBalance(aggregateSums);
}

const getPortfolioValueByTokenAndDate = async (token: string, date: string) => {

    const aggregateSums = await Transaction.aggregate(
        [
            {
                $group: {
                    _id: {
                        type: '$transaction_type',
                        token: '$token',
                        transaction_date: '$transaction_date'
                    },
                    total: {
                        $sum: "$amount"
                    }
                },
            },
            {
                $match: {
                    "_id.transaction_date": date,
                    "_id.token": token,
                }
            },
            {
                $project: {
                    _id: 0,
                    token: "$_id.token",
                    type: "$_id.type",
                    date: "$_id.date",
                    total: 1
                }
            },

            {
                $sort: { "_id.token": 1 }
            },
        ]
    );

    return calculateBalance(aggregateSums);
}

const calculateBalance = async (aggregateAmounts: any[]) => {
    const portfolioBalance = aggregateAmounts.reduce((acc, obj) => {
        acc[obj.token] ??= 0;
        const balance = obj.type == TransactionType.DEPOSIT
            ? parseFloat(acc[obj.token]) + parseFloat(obj.total)
            : parseFloat(acc[obj.token]) - parseFloat(obj.total);

        acc[obj.token] = balance.toFixed(DIGITS_AFTER_DECIMAL);

        return acc;
    }, {});

    await convertToUSDValue(portfolioBalance)
}

const convertToUSDValue = async (portfolio: any) => {

    for (const token in portfolio) {
        portfolio[token] = await convertCryptoToUSD(token, portfolio[token])
    }
    console.log(portfolio);

    return portfolio;
}
