import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const LineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 30, right: 60, bottom: 0, left: 0 };

    // Clear previous chart
    svg.selectAll("*").remove();

    // Define the gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", height - margin.bottom)
      .attr("x2", 0)
      .attr("y2", margin.top);

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "white");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#bfdbfe");

    // Calculate the min and max values for the Y-axis
    const minValue = d3.min(data, (d) => d.value);
    const maxValue = d3.max(data, (d) => d.value);

    // Adjust the Y scale to start just below the minimum value
    const yScale = d3
      .scaleLinear()
      .domain([minValue * 0.95, maxValue])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const yVolumeScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.volume)])
      .nice()
      .range([height - margin.bottom, height - 80]);

    const xScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const line = d3
      .line()
      .x((_, i) => xScale(i) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const area = d3
      .area()
      .x((_, i) => xScale(i) + xScale.bandwidth() / 2)
      .y0(height - margin.bottom)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#line-gradient)") // Apply the gradient fill
      .attr("d", area);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (_, i) => xScale(i))
      .attr("y", (d) => yVolumeScale(d.volume))
      .attr("width", xScale.bandwidth() * 0.8)
      .attr("height", (d) => height - margin.bottom - yVolumeScale(d.volume))
      .attr("fill", "rgba(128, 128, 128, 0.4)");

    const trackingGroup = svg
      .append("g")
      .attr("class", "tracking-group")
      .style("pointer-events", "none");

    const verticalLine = trackingGroup
      .append("line")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "10,5")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .style("opacity", 0);

    const horizontalLine = trackingGroup
      .append("line")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "10,5")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .style("opacity", 0);

    const tooltipGroup = svg
      .append("g")
      .attr("class", "tooltip-group")
      .style("pointer-events", "none");

    // Fixed tooltip for the last data point
    const lastPoint = data[data.length - 1];
    const lastPointX = xScale(data.length - 1) + xScale.bandwidth() / 2;
    const lastPointY = yScale(lastPoint.value);

    // Add a background rectangle with rounded corners for the fixed tooltip text
    tooltipGroup
      .append("rect")
      .attr("x", lastPointX - 40) // Adjust the x position to center the rectangle
      .attr("y", lastPointY - 30) // Adjust the y position above the circle
      .attr("width", 80)
      .attr("height", 30)
      .attr("fill", "#4B40EE") // Background color for the tooltip
      .attr("rx", 5) // Rounded corners
      .attr("ry", 5); // Rounded corners

    tooltipGroup
      .append("circle")
      .attr("cx", lastPointX)
      .attr("cy", lastPointY)
      .attr("r", 4)
      .attr("fill", "#4B40EE"); // Tooltip circle color

    tooltipGroup
      .append("text")
      .attr("x", lastPointX - 30) // Position text to fit inside rectangle
      .attr("y", lastPointY - 15) // Centered vertically within the rectangle
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "12px")
      .attr("fill", "white") // Text color
      .text(`${lastPoint.value}`);

    // Oscillating gray tooltip
    const grayTooltipGroup = svg
      .append("g")
      .attr("class", "gray-tooltip-group")
      .style("pointer-events", "none");

    const grayTooltipRect = grayTooltipGroup
      .append("rect")
      .attr("x", lastPointX - 40)
      .attr("y", height / 2 - 15) // Initial y position
      .attr("width", 80)
      .attr("height", 30)
      .attr("fill", "gray") // Gray background color
      .attr("rx", 5)
      .attr("ry", 5);

    const grayTooltipCircle = grayTooltipGroup
      .append("circle")
      .attr("cx", lastPointX)
      .attr("cy", height / 2) // Initial y position
      .attr("r", 4)
      .attr("fill", "gray"); // Gray tooltip circle color

    const grayTooltipText = grayTooltipGroup
      .append("text")
      .attr("x", lastPointX - 30)
      .attr("y", height / 2 - 15)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "12px")
      .attr("fill", "white")
      .text("Value"); // Placeholder text

    svg.on("mousemove", function (event) {
        grayTooltipGroup.style("opacity", 1);
      const [x, y] = d3.pointer(event);

      // Find the closest data point
      const xIndex = xScale.domain().findIndex((i) => {
        const xPos = xScale(i) + xScale.bandwidth() / 2;
        return xPos >= x;
      });
      const dataIndex = xIndex === -1 ? data.length - 1 : xIndex;
      const closestDataPoint = data[dataIndex];

      // Find the y coordinate of the closest data point
      const closestY = yScale(closestDataPoint.value);

      // Update the oscillating gray tooltip
      grayTooltipGroup
        .select("rect")
        .attr("x", lastPointX - 40)
        .attr("y", y - 15); // Center vertically with respect to the mouse y position

      grayTooltipGroup.select("circle").attr("cx", lastPointX).attr("cy", y);

      grayTooltipGroup
        .select("text")
        .attr("x", lastPointX - 30)
        .attr("y", y + 3)
        .text(closestDataPoint ? `${closestDataPoint.value}` : "Value");

      // Update the fixed tooltip position
      tooltipGroup
        .select("rect")
        .attr("x", lastPointX - 40)
        .attr("y", lastPointY - 30);

      tooltipGroup
        .select("circle")
        .attr("cx", lastPointX)
        .attr("cy", lastPointY);

      tooltipGroup
        .select("text")
        .attr("x", lastPointX - 30)
        .attr("y", lastPointY - 15);

      verticalLine.attr("x1", x).attr("x2", x).style("opacity", 1);

      horizontalLine.attr("y1", y).attr("y2", y).style("opacity", 1);
    });

    svg.on("mouseleave", function () {
      verticalLine.style("opacity", 0);
      horizontalLine.style("opacity", 0);
      grayTooltipGroup.style("opacity", 0);
    });

    // svg.on("mousemove", function () {
    //   grayTooltipGroup.style("opacity", 1);
    // });
  }, [data]);

  return <svg ref={svgRef} width="800" height="400"></svg>;
};

export default LineChart;
