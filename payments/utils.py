from datetime import timedelta


def last_day_of_month(any_day):
    # reurl last day for given month
    next_month = any_day.replace(day=28) + timedelta(days=4)
    return next_month - timedelta(days=next_month.day)
