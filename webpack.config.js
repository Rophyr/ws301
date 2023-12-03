module.exports = {
  entry: {
    main: './public/js/main.js',
    calendar: './public/js/calendar.js',
    mainStyles: './public/css/main-styles.css',
    calendarStyles: './public/css/calendar-styles.css',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/build'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
