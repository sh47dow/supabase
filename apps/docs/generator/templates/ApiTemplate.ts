const template = `
---
id: usage
slug: /usage
title: Usage
toc_max_heading_level: 3
---


<!-- AUTOGENERATED: DO NOT EDIT DIRECTLY IF THIS IS VERSION "next" -->

<%- info.description %>

<!-- AUTOGENERATED: DO NOT EDIT DIRECTLY IF THIS IS VERSION "next" -->


<% sections.forEach(function(section){ %>

## <%- section.title %> [#<%= section.id %>]

<%- section.description %>

<% section.operations.forEach(function(operation){ %>

<!-- AUTOGENERATED: DO NOT EDIT DIRECTLY IF THIS IS VERSION "next" -->

### <%- operation.summary %> [#<%- operation.operationId %>]

\`\`\`
<%- operation.operation.toUpperCase() %> <%- operation.fullPath %>
\`\`\`

<!-- AUTOGENERATED: DO NOT EDIT DIRECTLY IF THIS IS VERSION "next" -->

<% if(operation.parameters && operation.parameters.filter((parameter) => parameter.in === 'path').length > 0){ %>
#### Path Parameters

<ul className="method-list-group">
<%  operation.parameters
.filter((parameter) => parameter.in === 'path').forEach(function(parameter){ %>
<li className="method-list-item">
    <h4 className="method-list-item-label">
        <span className="method-list-item-label-name">
        <%- parameter.name %>
        </span>
        <span className="method-list-item-label-badge">
        <%- parameter.required ? 'required' : 'optional' %>
        </span>
        <span className="method-list-item-validation">
        <%- parameter.type %>
        </span>
    </h4>
    <% if(parameter.example){ %>
    <h4 className="method-list-item-label">
        Example:
        <span className="method-list-item-label-badge">
            <%- parameter.example %>
        </span>
    </h4>
    <% } %>
    <div class="method-list-item-description">
        <%- parameter.description %>
    </div>
</li>
<% }); %>
</ul>
<% }; %>

<% if(operation.parameters && operation.parameters.filter((parameter) => parameter.in === 'header').length > 0){ %>
#### Header Parameters
<ul className="method-list-group">
<%  operation.parameters
.filter((parameter) => parameter.in === 'header').forEach(function(parameter){ %>
<li className="method-list-item">
    <h4 className="method-list-item-label">
        <span className="method-list-item-label-name">
        <%- parameter.name %>
        </span>
        <span className="method-list-item-label-badge">
        <%- parameter.required ? 'required' : 'optional' %>
        </span>
        <span className="method-list-item-validation">
        <%- parameter.type %>
        </span>
    </h4>
    <% if(parameter.example){ %>
    <h4 className="method-list-item-label">
        Example:
        <span className="method-list-item-label-badge">
            <%- parameter.example %>
        </span>
    </h4>
    <% } %>
    <div class="method-list-item-description">
        <%- parameter.description %>
    </div>
</li>
<% }); %>
</ul>
<% }; %>


<!-- AUTOGENERATED: DO NOT EDIT DIRECTLY IF THIS IS VERSION "next" -->

<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
#### Body Parameters

\`\`\`json
<%- JSON.stringify(operation.requestBody?.content['application/json'], null, 2)  %>
\`\`\`
<% }; %>

<!-- AUTOGENERATED: DO NOT EDIT DIRECTLY IF THIS IS VERSION "next" -->

#### Responses

<Tabs scrollable size="small" type="underlined" defaultActiveId="<%- operation.responseList[0].responseCode %>">
<% operation.responseList.forEach(function(response){ %>
<TabPanel id="<%- response.responseCode  %>" label="<%- response.responseCode  %>">

<%- response.description  %>

<!-- AUTOGENERATED: DO NOT EDIT DIRECTLY IF THIS IS VERSION "next" -->

<% if(response?.content && response?.content['application/json']){ %>
\`\`\`json
<%- JSON.stringify(response.content['application/json'], null, 2)  %>
\`\`\`
<% }; %>

<!-- AUTOGENERATED: DO NOT EDIT DIRECTLY IF THIS IS VERSION "next" -->

</TabPanel>
<% }); %>
</Tabs>

<br />
<% }); %>
<% }); %>


`.trim()

export default template
