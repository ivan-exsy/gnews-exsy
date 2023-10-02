# custom_filters.py

from django import template
from gnews.utils.constants import AVAILABLE_COUNTRIES

register = template.Library()

@register.filter(name='dict_items_to_list')
def dict_items_to_list(dictionary):
    return list(dictionary.items())