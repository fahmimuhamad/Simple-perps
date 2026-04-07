export type Lang = "en" | "id";

export const translations = {
  en: {
    // VariantSelectionScreen
    chooseConceptToTest: "Choose a concept to test",
    optionAFlow: "Option A — Current Flow",
    optionAPos: "Option A — Open Position",
    optionBView: "Option B — Simplified View",
    optionBPos: "Option B — Open Position",
    optionCFlow: "Option C — Leverage Illustration",
    optionCPos: "Option C — Open Position",

    // InitialScreen
    fundingCountdown: "Funding / Countdown",
    userPositionDistribution: "User Position Distribution",
    positionDistributionDisclaimer: "Based on current open positions by other Pintu users for this asset. This is not financial advice.",
    profitWhenUp: "Profit when price goes up",
    profitWhenDown: "Profit when price goes down",
    chooseDirection: "Choose Direction",
    longDescription: "Predict price goes up. Profit from the price increase.",
    shortDescription: "Predict price goes down. Profit from the price decrease.",
    positions: "Positions",
    noOpenPositions: "No Open Positions",
    home: "Home",
    market: "Market",
    trade: "Trade",
    openPosition: "Open Position",
    futures: "Futures",
    wallet: "Wallet",

    // OrderTypeSheet
    investmentMargin: "Investment Margin",
    positionSize: "Pos. Size ~ USDT",
    leverage: "Leverage",
    availableBalance: "Available Balance",
    openLong: "Open Long",
    openShort: "Open Short",

    // PositionCard / PositionCardB
    unrealizedPnl: "Unrealized P&L",
    positionSizeUsdt: "Position Size (USDT)",
    marginUsdt: "Margin (USDT)",
    entryPriceUsdt: "Entry Price (USDT)",
    currentPriceUsdt: "Current Price (USDT)",
    estLiqPrice: "Est. Liquidation Price",
    adjustPosition: "Adjust Position",
    closePosition: "Close Position",

    // TpSlSheet
    takeProfitStopLoss: "Take Profit/Stop Loss",
    takeProfitPrice: "Take Profit Price (TP)",
    stopLossPrice: "Stop Loss Price (SL)",
    profitAmount: "Profit Amount",
    lossAmount: "Loss Amount",
    enterPnlAmount: "Enter PnL amount",
    enterLossAmount: "Enter loss amount",
    enterPrice: "Enter price",
    estimatedPrice: "Estimated Price",
    estimatedProfit: "Estimated Profit",
    estimatedLoss: "Estimated Loss",
    slBelowLiqError: "Stop Loss Trigger Price must be higher than Liquidation Price",
    tpMustBeAboveEntry: "Take Profit price must be above entry price for Long",
    tpMustBeBelowEntry: "Take Profit price must be below entry price for Short",
    slMustBeBelowEntry: "Stop Loss price must be below entry price for Long",
    slMustBeAboveEntry: "Stop Loss price must be above entry price for Short",
    confirm: "Confirm",

    // ConfirmationSheet
    orderConfirmation: "Order Confirmation",
    side: "Side",
    price: "Price",
    amount: "Amount",
    estLiqPriceShort: "Est. Liquidation Price",
    dontShowAgain: "Don't show this confirmation page again. This can be configured later in Settings.",
    cancel: "Cancel",

    // LeverageSheet
    leverageDescription: "Multiply the amount you're investing. Higher leverage gives you higher return but with higher risk.",
    min: "Min",
    max: "Max",
    investment: "Investment",
    estLiqPriceLeverage: "Est. Liquidation Price",

    // AddRemoveMarginSheet
    addMargin: "Add Margin",
    removeMargin: "Remove Margin",
    size: "Size",
    lockedMargin: "Locked Margin",
    marginToAdd: "Margin to Add (USDT)",
    marginToRemove: "Margin to Remove (USDT)",
    maxAdditionalMargin: "Max Additional Margin:",
    maxRemovableMargin: "Max Removable Margin:",
    enterMarginToAdd: "Enter Margin to Add",
    enterMarginToRemove: "Enter Margin to Remove",
    estLiqPriceMargin: "Est Liquidation Price",

    // TransferSheet
    transferBalance: "Transfer Balance",
    transferDescription: "Easily transfer balances between Pintu wallets for free.",
    from: "From",
    pintuSpot: "Pintu Spot",
    to: "To",
    available: "Available:",
    transfer: "Transfer",

    // TransferSuccessScreen
    transferring: "Transferring USDT",
    pintuFutures: "Pintu Futures",
    blockchainFee: "Blockchain Fee",
    free: "Free",
    ok: "OK",
    viewHistory: "View History",

    // InsufficientMarginSheet
    insufficientMarginTitle: "Insufficient Margin Balance",
    insufficientMarginBody: "To trade your desired amount, you can:",
    insufficientMarginSteps: "1. Add more margin by transferring USDT to your Futures wallet.\n2. Buy USDT from the Spot market, then transfer to your Futures wallet.",
    insufficientMarginNote: "You can still trade by using a smaller amount.",
    transferToFutures: "Transfer USDT to Futures Wallet",
    buyUsdt: "Buy USDT",

    // OnboardingSheet
    whatIsFutures: "What is Futures?",
    whatIsFuturesBody: "Trade the price movements of crypto assets. Get profit when prices rise or fall.",
    next: "Next",
    goingLong: "Going Long",
    goingLongBody: 'Open a “Long” position if you expect an increase.',
    goingShort: "Going Short",
    goingShortBody: 'Open a “Short” position if you expect a drop.',
    tradeOnPintu: "Trade on Pintu",

    // CoachmarkOverlay (A)
    coachA1Title: "Position monitoring",
    coachA1Body: "Track your unrealized P&L and manage your trade in real-time. Use the options to adjust your Stop Loss or Take Profit settings easily. Stay in control of your strategy.",
    coachA2Title: "Track your floating profit/loss",
    coachA2Body: "See your ROI in real-time based on the difference between your entry price and the current market price, amplified by your leverage.",
    coachA3Title: "Monitor your Liquidation Price",
    coachA3Body: "Add margin to keep your position safe.",

    // CoachmarkOverlayB (B)
    coachB1Title: "This Is Your Position",
    coachB1Body: "Monitor your unrealized P&L here and easily adjust your TP/SL settings anytime.",
    coachB2Title: "Track Your Floating P&L",
    coachB2Body: "See your ROI in real-time based on the difference between your entry price and the current market price, amplified by your leverage.",

    // LeverageSheetC illustration
    illustrationBadge: "Illustration",
    illustrationTitle: "How leverage amplifies your profit",
    priceScenario: "Price scenario",
    spotLabel: "Spot 1x",
    cantProfit: "Can't profit",
    leverageMultiplierLabel: "potential profit vs Spot",
  },

  id: {
    // VariantSelectionScreen
    chooseConceptToTest: "Pilih konsep untuk diuji",
    optionAFlow: "Opsi A — Alur Saat Ini",
    optionAPos: "Opsi A — Open Position",
    optionBView: "Opsi B — Tampilan Sederhana",
    optionBPos: "Opsi B — Open Position",
    optionCFlow: "Opsi C — Ilustrasi Leverage",
    optionCPos: "Opsi C — Open Position",

    // InitialScreen
    fundingCountdown: "Funding / Hitung Mundur",
    userPositionDistribution: "Distribusi Posisi Pengguna",
    positionDistributionDisclaimer: "Berdasarkan open position pengguna Pintu lainnya untuk aset ini. Ini bukan saran keuangan.",
    profitWhenUp: "Untung ketika harga naik",
    profitWhenDown: "Untung ketika harga turun",
    chooseDirection: "Pilih Arah Trading",
    longDescription: "Untung dari kenaikan harga.",
    shortDescription: "Untung dari penurunan harga.",
    positions: "Posisi",
    noOpenPositions: "Tidak Ada Open Position",
    home: "Beranda",
    market: "Pasar",
    trade: "Trading",
    openPosition: "Trade",
    futures: "Futures",
    wallet: "Dompet",

    // OrderTypeSheet
    investmentMargin: "Margin Investasi",
    positionSize: "Jumlah Posisi",
    leverage: "Leverage",
    availableBalance: "Saldo Tersedia",
    openLong: "Open Long",
    openShort: "Open Short",

    // PositionCard / PositionCardB
    unrealizedPnl: "Unrealized P&L",
    positionSizeUsdt: "Ukuran Posisi (USDT)",
    marginUsdt: "Margin (USDT)",
    entryPriceUsdt: "Harga Entry (USDT)",
    currentPriceUsdt: "Harga Saat Ini (USDT)",
    estLiqPrice: "Perkiraan Harga Likuidasi",
    adjustPosition: "Sesuaikan Posisi",
    closePosition: "Tutup Posisi",

    // TpSlSheet
    takeProfitStopLoss: "Take Profit/Stop Loss",
    takeProfitPrice: "Harga Take Profit (TP)",
    stopLossPrice: "Harga Stop Loss (SL)",
    profitAmount: "Jumlah Profit",
    lossAmount: "Jumlah Loss",
    enterPnlAmount: "Masukkan jumlah PnL",
    enterLossAmount: "Masukkan jumlah kerugian",
    enterPrice: "Masukkan harga",
    estimatedPrice: "Perkiraan Harga",
    estimatedProfit: "Perkiraan Profit",
    estimatedLoss: "Perkiraan Kerugian",
    slBelowLiqError: "Harga Trigger Stop Loss harus lebih tinggi dari Harga Likuidasi",
    tpMustBeAboveEntry: "Harga Take Profit harus di atas harga entry untuk Long",
    tpMustBeBelowEntry: "Harga Take Profit harus di bawah harga entry untuk Short",
    slMustBeBelowEntry: "Harga Stop Loss harus di bawah harga entry untuk Long",
    slMustBeAboveEntry: "Harga Stop Loss harus di atas harga entry untuk Short",
    confirm: "Konfirmasi",

    // ConfirmationSheet
    orderConfirmation: "Konfirmasi Order",
    side: "Arah",
    price: "Harga",
    amount: "Jumlah",
    estLiqPriceShort: "Perkiraan Harga Likuidasi",
    dontShowAgain: "Jangan tampilkan halaman konfirmasi ini lagi. Dapat diatur kembali di Pengaturan.",
    cancel: "Batal",

    // LeverageSheet
    leverageDescription: "Kalikan jumlah investasi kamu. Leverage lebih tinggi memberi return lebih besar namun dengan risiko lebih tinggi.",
    min: "Min",
    max: "Maks",
    investment: "Investasi",
    estLiqPriceLeverage: "Perkiraan Harga Likuidasi",

    // AddRemoveMarginSheet
    addMargin: "Tambah Margin",
    removeMargin: "Kurangi Margin",
    size: "Ukuran",
    lockedMargin: "Margin Terkunci",
    marginToAdd: "Margin yang Ditambahkan (USDT)",
    marginToRemove: "Margin yang Dikurangi (USDT)",
    maxAdditionalMargin: "Maks Tambahan Margin:",
    maxRemovableMargin: "Maks Margin yang Bisa Dikurangi:",
    enterMarginToAdd: "Masukkan Margin yang Ditambahkan",
    enterMarginToRemove: "Masukkan Margin yang Dikurangi",
    estLiqPriceMargin: "Perkiraan Harga Likuidasi",

    // TransferSheet
    transferBalance: "Transfer Saldo",
    transferDescription: "Transfer saldo antar dompet Pintu secara gratis.",
    from: "Dari",
    pintuSpot: "Pintu Spot",
    to: "Ke",
    available: "Tersedia:",
    transfer: "Transfer",

    // TransferSuccessScreen
    transferring: "Mentransfer USDT",
    pintuFutures: "Pintu Futures",
    blockchainFee: "Biaya Blockchain",
    free: "Gratis",
    ok: "OK",
    viewHistory: "Lihat Riwayat",

    // InsufficientMarginSheet
    insufficientMarginTitle: "Saldo Margin Tidak Cukup",
    insufficientMarginBody: "Untuk trading dengan jumlah yang kamu inginkan, kamu bisa:",
    insufficientMarginSteps: "1. Tambah margin dengan mentransfer USDT ke dompet Futures kamu.\n2. Beli USDT di pasar Spot, lalu transfer ke dompet Futures kamu.",
    insufficientMarginNote: "Kamu tetap bisa trading dengan jumlah yang lebih kecil.",
    transferToFutures: "Transfer USDT ke Dompet Futures",
    buyUsdt: "Beli USDT",

    // OnboardingSheet
    whatIsFutures: "Apa itu Futures?",
    whatIsFuturesBody: "Trading pergerakan harga aset crypto. Dapatkan potensi keuntungan saat harga naik ataupun turun.",
    next: "Lanjut",
    goingLong: "Going Long",
    goingLongBody: 'Buka posisi “Long” saat kamu memperkirakan harga naik.',
    goingShort: "Going Short",
    goingShortBody: 'Buka posisi “Short” saat kamu memperkirakan harga turun.',
    tradeOnPintu: "Mulai Trading di Pintu",

    // CoachmarkOverlay (A)
    coachA1Title: "Pantau Posisi",
    coachA1Body: "Pantau Unrealized P&L kamu dan kelola trading secara real-time. Gunakan opsi untuk menyesuaikan Stop Loss atau Take Profit dengan mudah. Tetap kendalikan strategi kamu.",
    coachA2Title: "Pantau Floating Profit/Loss",
    coachA2Body: "Lihat ROI kamu secara real-time berdasarkan selisih harga entry dan harga pasar saat ini, diperbesar oleh leverage kamu.",
    coachA3Title: "Pantau Harga Likuidasi",
    coachA3Body: "Tambah margin untuk menjaga keamanan posisi kamu.",

    // CoachmarkOverlayB (B)
    coachB1Title: "Ini Posisi Kamu",
    coachB1Body: "Pantau Unrealized P&L kamu di sini dan sesuaikan pengaturan TP/SL kapan saja.",
    coachB2Title: "Pantau Floating P&L",
    coachB2Body: "Lihat ROI kamu secara real-time berdasarkan selisih harga entry dan harga pasar saat ini, diperbesar oleh leverage kamu.",

    // LeverageSheetC illustration
    illustrationBadge: "Ilustrasi",
    illustrationTitle: "Bagaimana leverage memperbesar profitmu",
    priceScenario: "Skenario harga",
    spotLabel: "Spot 1x",
    cantProfit: "Tidak bisa profit",
    leverageMultiplierLabel: "potensi profit vs Spot",
  },
} satisfies Record<Lang, Record<string, string>>;

export type TranslationKey = keyof typeof translations.en;
