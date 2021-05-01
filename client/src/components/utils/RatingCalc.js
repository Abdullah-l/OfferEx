export const labels = {
    0: 'Unrated',
    1: 'Terrible',
    2: 'Poor',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

export const ratingCalc = (rArr) => {
    if (rArr.length === 0)
    return 0;

    return Math.round(rArr.reduce((t,n) => t+n,0)/rArr.length);
  }