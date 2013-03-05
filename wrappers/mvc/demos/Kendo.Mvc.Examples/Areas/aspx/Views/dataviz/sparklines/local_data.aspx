﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Areas/aspx/Views/Shared/DataViz.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
<div class="chart-wrapper">
    <table id="stats" class="stats">
        <thead>
            <tr>
                <th class="year">Year</th>
                <th class="hourly">Compensation costs</th>
                <th class="change">Annual change %</th>
                <th class="direct">Direct Pay</th>
                <th class="benefits">Benefit components</th>
            </tr>
        </thead>
        <tbody>
<%
for (int i = 0; i < months.Length; i++) {
    var monthNumber = i + 1;
    var readUrl = Url.Action("_Weather", "Sparklines", new { station = "SOFIA", year = 2012, month = monthNumber });
%>
        <tr class="rows">
            <td class="year"><%= row.Date.Year %></td>
            <td>
                <%= Html.Kendo().Sparkline()
                        .Name("sparkline-tmax-" + i)
                        .DataSource(ds => ds.Read(read => read.Url(readUrl)))
                        .Series(series => series
                            .Column("TMax").Color("#ff0000").NegativeColor("#0099ff")
                        )
                %>
            </td>
            <td>
                <%= Html.Kendo().Sparkline()
                        .Name("sparkline-wnd-" + i)
                        .DataSource(ds => ds.Read(read => read.Url(readUrl)))
                        .Series(series => series
                            .Line("Wind").Color("#5b8f00")
                        )
                %>
            </td>
            <td>
                <%= Html.Kendo().Sparkline()
                        .Name("sparkline-rain-" + i)
                        .DataSource(ds => ds.Read(read => read.Url(readUrl)))
                        .Series(series => series
                            .Area("Rain").Color("#0099ff")
                        )
                %>
            </td>
        </tr>
<%
}
%>
        </tbody>
    </table>
</div>
</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .chart-wrapper {
            height: 370px;
        }
        .chart-wrapper .k-chart {
            width: auto;
            height: auto;
        }
        .weather {
            border-collapse: collapse;
            line-height: 50px;
        }
        .weather td, .weather th {
            padding: 0;
            width: 200px;
            text-align: center;
        }
        .weather .month, .weather .month {
            width: 80px;
            text-align: right;
            padding-right: 20px;
        }
    </style>
</asp:Content>
