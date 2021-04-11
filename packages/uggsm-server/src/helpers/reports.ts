import { isArray, isObject } from 'lodash'
export const aggregationsList = {
  default: (match) => [
    {
      $lookup: {
        from: 'offices',
        localField: 'office',
        foreignField: '_id',
        as: 'office',
      },
    },
    {
      $unwind: {
        path: '$office',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'master',
        foreignField: '_id',
        as: 'master',
      },
    },
    {
      $unwind: {
        path: '$master',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'manager',
        foreignField: '_id',
        as: 'manager',
      },
    },
    {
      $unwind: {
        path: '$manager',
      },
    },
    {
      $lookup: {
        from: 'cashes',
        localField: 'id',
        foreignField: 'orderid',
        as: 'cash',
      },
    },
    {
      $match: match,
    },
    {
      $unwind: {
        path: '$statusWork',
      },
    },
    {
      $addFields: {
        idString: {
          $toString: '$id',
        },
        statusWork: {
          priceString: {
            $toString: '$statusWork.price',
          },
        },
      },
    },
    {
      $project: {
        master: '$statusWork.credentials',
        manager: '$manager.credentials',
        date: '$closedAt',
        type: 'Исполнителю за работу в заказе',
        product: {
          $concat: ['Заказ №', '$idString', ' ', '$phoneModel', ' (', '$serialNumber', ') '],
        },
        works: {
          work: { $concat: ['$statusWork.header', ' (', '$statusWork.message', ') '] },
          total: '$statusWork.price',
        },
        price: '$statusWork.price',
        total: '$statusWork.price',
      },
    },
    {
      $group: {
        _id: {
          master: '$master',
          type: '$type',
          product: '$product',
          date: '$date',
        },
        works: {
          $push: '$works',
        },
        price: {
          $sum: '$price',
        },
        total: {
          $sum: '$total',
        },
      },
    },
    {
      $project: {
        _id: 0,
        master: '$_id.master',
        type: '$_id.type',
        date: '$_id.date',
        product: '$_id.product',
        works: 1,
        price: 1,
        total: 1,
      },
    },
  ],
  profit: (match) => [
    {
      $lookup: {
        from: 'offices',
        localField: 'office',
        foreignField: '_id',
        as: 'office',
      },
    },
    {
      $unwind: {
        path: '$office',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'master',
        foreignField: '_id',
        as: 'master',
      },
    },
    {
      $unwind: {
        path: '$master',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'manager',
        foreignField: '_id',
        as: 'manager',
      },
    },
    {
      $unwind: {
        path: '$manager',
      },
    },
    {
      $lookup: {
        from: 'cashes',
        localField: 'id',
        foreignField: 'orderid',
        as: 'cash',
      },
    },
    {
      $match: match,
    },
    {
      $unwind: {
        path: '$statusWork',
      },
    },
    {
      $unwind: {
        path: '$usedDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        idString: {
          $toString: '$id',
        },
      },
    },
    {
      $project: {
        master: '$statusWork.credentials',
        manager: '$manager.credentials',
        date: '$closedAt',
        type: 'Исполнителю за работу в заказе',
        product: {
          $concat: ['Заказ №', '$idString', ' ', '$phoneModel', ' (', '$serialNumber', ') '],
        },
        works: {
          work: { $concat: ['$statusWork.header', ' (', '$statusWork.message', ') '] },
          total: '$statusWork.price',
        },
        details: {
          detail: '$usedDetails.header',
          total: '$usedDetails.price',
        },
        detailsPrice: '$usedDetails.price',
        worksPrice: '$statusWork.price',
      },
    },
    {
      $group: {
        _id: {
          master: '$master',
          type: '$type',
          product: '$product',
          date: '$date',
        },
        works: { $push: '$works' },
        details: { $push: '$details' },
        detailsPrice: { $sum: '$detailsPrice' },
        worksPrice: { $sum: '$worksPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        master: '$_id.master',
        type: '$_id.type',
        date: '$_id.date',
        product: '$_id.product',
        works: 1,
        details: 1,
        worksPrice: 1,
        detailsPrice: 1,
      },
    },
  ],
  count: (match) => [
    {
      $lookup: {
        from: 'offices',
        localField: 'office',
        foreignField: '_id',
        as: 'office',
      },
    },
    {
      $unwind: {
        path: '$office',
      },
    },
    {
      $match: match,
    },
    {
      $group: {
        _id: {
          $concat: ['$office.code', '|', '$office.name'],
        },
        count: {
          $sum: 1,
        },
        statuses: {
          $addToSet: '$status',
        },
      },
    },
    {
      $project: {
        _id: 0,
        office: '$_id',
        count: 1,
        statuses: 1,
      },
    },
  ],
  withoutWork: (match) => [
    {
      $lookup: {
        from: 'offices',
        localField: 'office',
        foreignField: '_id',
        as: 'office',
      },
    },
    {
      $unwind: {
        path: '$office',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'master',
        foreignField: '_id',
        as: 'master',
      },
    },
    {
      $unwind: {
        path: '$master',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'manager',
        foreignField: '_id',
        as: 'manager',
      },
    },
    {
      $unwind: {
        path: '$manager',
      },
    },
    {
      $lookup: {
        from: 'cashes',
        localField: 'id',
        foreignField: 'orderid',
        as: 'cash',
      },
    },
    {
      $addFields: {
        cashIncome: {
          $sum: '$cash.income',
        },
      },
    },
    {
      $match: match,
    },
    {
      $addFields: {
        idString: {
          $toString: '$id',
        },
      },
    },
    {
      $project: {
        office: {
          $concat: ['$office.code', '|', '$office.name'],
        },
        master: '$master.credentials',
        manager: '$manager.credentials',
        createdAt: '$createdAt',
        closedAt: '$closedAt',
        id: '$id',
        product: {
          $concat: ['Заказ №', '$idString', ' ', '$phoneModel', ' (', '$serialNumber', ')'],
        },
      },
    },
    {
      $group: {
        _id: '$office',
        orders: {
          $push: {
            master: '$master',
            manager: '$manager',
            createdAt: '$createdAt',
            closedAt: '$closedAt',
            id: '$id',
            product: '$product',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        office: '$_id',
        orders: '$orders',
      },
    },
  ],
  daily: (newMatch, closedMatch) => ({
    new: [
      {
        $lookup: {
          from: 'offices',
          localField: 'office',
          foreignField: '_id',
          as: 'office',
        },
      },
      {
        $unwind: {
          path: '$office',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'master',
          foreignField: '_id',
          as: 'master',
        },
      },
      {
        $unwind: {
          path: '$master',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'manager',
          foreignField: '_id',
          as: 'manager',
        },
      },
      {
        $unwind: {
          path: '$manager',
        },
      },
      {
        $lookup: {
          from: 'cashes',
          localField: 'id',
          foreignField: 'orderid',
          as: 'cash',
        },
      },
      {
        $addFields: {
          cashIncome: {
            $sum: '$cash.income',
          },
        },
      },
      {
        $match: newMatch,
      },
      {
        $group: {
          _id: {
            $concat: ['$office.code', '|', '$office.name'],
          },
          orders: {
            $push: {
              id: '$id',
              client: '$customerName',
              defect: '$declaredDefect',
              phone: '$phoneModel',
            },
          },
          ordersTotal: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          office: '$_id',
          orders: 1,
          ordersTotal: 1,
        },
      },
    ],
    closed: [
      {
        $lookup: {
          from: 'offices',
          localField: 'office',
          foreignField: '_id',
          as: 'office',
        },
      },
      {
        $unwind: {
          path: '$office',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'master',
          foreignField: '_id',
          as: 'master',
        },
      },
      {
        $unwind: {
          path: '$master',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'manager',
          foreignField: '_id',
          as: 'manager',
        },
      },
      {
        $unwind: {
          path: '$manager',
        },
      },
      {
        $lookup: {
          from: 'cashes',
          localField: 'id',
          foreignField: 'orderid',
          as: 'cash',
        },
      },
      {
        $addFields: {
          cashIncome: {
            $sum: '$cash.income',
          },
        },
      },
      {
        $match: closedMatch,
      },
      {
        $group: {
          _id: {
            $concat: ['$office.code', '|', '$office.name'],
          },
          orders: {
            $push: {
              id: '$id',
              client: '$customerName',
              defect: '$declaredDefect',
              phone: '$phoneModel',
              worksPrice: {
                $sum: '$statusWork.price',
              },
              cashPrice: {
                $subtract: [
                  {
                    $sum: '$cash.income',
                  },
                  {
                    $sum: '$cash.consumption',
                  },
                ],
              },
            },
          },
          ordersTotal: {
            $sum: 1,
          },
        },
      },
      {
        $addFields: {
          cashSum: {
            $sum: '$orders.cashPrice',
          },
          worksSum: {
            $sum: '$orders.worksPrice',
          },
        },
      },
      {
        $project: {
          _id: 0,
          office: '$_id',
          orders: 1,
          ordersTotal: 1,
          cashSum: 1,
          worksSum: 1,
        },
      },
    ],
  }),
}

export default async function (
  params: { date?: string | string[]; office?: string; status?: string; type?: string },
  model: any
) {
  let aggregate
  if (params.type === 'count') {
    const options: { createdAt: any; status?: any } = {
      createdAt: {
        $gte: new Date(params.date[0]),
        $lt: new Date(params.date[1]),
      },
    }

    if (params.status) {
      options.status = { $in: params.status }
    }

    aggregate = aggregationsList.count(options)
  } else if (params.type === 'without-work') {
    aggregate = aggregationsList.withoutWork({
      status: { $in: params.status },
      $or: [
        {
          statusWork: [],
        },
        {
          cashIncome: 0,
        },
      ],
      closedAt: {
        $gte: new Date(params.date[0]),
        $lt: new Date(params.date[1]),
      },
      createdAt: {
        $exists: true,
      },
    })
  } else if (params.type === 'daily') {
    aggregate = aggregationsList.daily(
      {
        createdAt: {
          $gte: new Date(params.date[0]),
          $lt: new Date(params.date[1]),
        },
      },
      {
        closedAt: {
          $gte: new Date(params.date[0]),
          $lt: new Date(params.date[1]),
        },
        status: 'Закрыт',
      }
    )
  } else if (params.type === 'profit') {
    aggregate = aggregationsList.profit({
      status: { $in: params.status },
      'office.code': params.office,
      closedAt: {
        $gte: new Date(params.date[0]),
        $lt: new Date(params.date[1]),
      },
      statusWork: { $gte: [] },
    })
  } else {
    aggregate = aggregationsList.default({
      status: { $in: params.status },
      'office.code': params.office,
      closedAt: {
        $gte: new Date(params.date[0]),
        $lt: new Date(params.date[1]),
      },
      statusWork: { $gte: [] },
    })
  }

  let aggregated = {}
  if (isArray(aggregate)) {
    aggregated = await model.aggregate(aggregate)
  } else if (isObject(aggregate)) {
    for (const key in aggregate) {
      aggregated[key] = await model.aggregate(aggregate[key])
    }
  }

  return aggregated
}
