import re
from django_hosts import patterns, host

host_patterns = patterns(
    "",
    host(re.sub(r"_", r"-", r"arches_her"), "arches_her.urls", name="arches_her"),
)
