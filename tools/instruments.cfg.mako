[musical-speaker-category]
% for category, inst_dumps in dumps.items():
${category}=${category}
% endfor

[musical-speaker-instrument]
% for category, inst_dumps in dumps.items():
# category ${category}
% for inst_dump in inst_dumps:
${inst_dump.inst_code}=${inst_dump.inst_name}
% endfor
% endfor
