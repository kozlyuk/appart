""" Business logic for condominium app """


def is_int(element):
    try:
        int(element)
        return True
    except ValueError:
        return False
