import React from "react";
import styled from 'styled-components';
import Members from "../shared/Members";
import { useSelectedGuild } from '../../store/useSelectedGuild';
// import Card from "../shared/Card";

const OverviewWrapper = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
`

const OverviewText = styled.span`
	padding: 1em;
	font-weight: bold;
	font-size: x-large;
`

const Overview: React.FC = () => {
	const selectedGuild = useSelectedGuild(state => state.selectedGuild);
	const options = ['overview', 'members', 'calendar', 'kanban']
	return (
		<OverviewWrapper>
			<OverviewWrapper>
				{selectedGuild &&
					<OverviewText>Bienvenido a {selectedGuild?.name}</OverviewText>
				}
				{
					// options.map((option, index) => (
					// 	// <Card>{option}</Card>
					// ))
				}
			</OverviewWrapper>
			<Members />
		</OverviewWrapper>
	);
};

export default Overview;

