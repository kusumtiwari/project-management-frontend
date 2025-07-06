import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import ButtonLoadingSpinner from '../../components/elements/ButtonLoadingSpinner';
import { useTeamSetup } from '../login/useLoginActions';
import { useSessionStore } from '../../session/useSessionStore';
import { useNavigate } from 'react-router-dom';

type Props = {
    onSkip?: () => void;
}

const TeamSetup: React.FC<Props> = ({ onSkip }) => {
    const [teamName, setTeamName] = React.useState('');
    const {mutate:createTeam, isPending:isLoading} = useTeamSetup();
    const { setProfile } = useSessionStore();
    const navigate = useNavigate();

    const onHandleCreateTeam = () => {
        console.log(teamName,'team name')
       createTeam({name: teamName},{
           onSuccess: (response: any) => {
               console.log(response, "team setup");
               setProfile(response?.profile);
               navigate('/')
           },
           onError: (error: unknown) => {
               console.error("Team setup failed:", error);
          },
       })
    }

    const handleSkip = () => {
        if (onSkip) {
            onSkip();
        }
    };

    return (
        <div className="flex h-screen w-screen justify-center items-center bg-stone-100">
            {/* Main centered container */}
            <div className="flex w-full max-w-4xl h-[80%] shadow-2xl rounded overflow-hidden">

                {/* Left section - maroon welcome area */}
                <div className="hidden md:flex md:w-[45%] bg-red-900 flex-col justify-center items-center p-8 text-white overflow-hidden relative">
                    <div className="w-full max-w-md space-y-6">
                        <h1 className="text-3xl md:text-4xl font-semibold leading-snug tracking-tight z-10 text-center">
                            <span className="block text-white/90 text-lg md:text-xl">
                                Set Up Your
                            </span>
                            <span className="block text-4xl md:text-5xl font-extrabold text-amber-200 mt-2 drop-shadow-sm">
                                TEAM
                            </span>
                        </h1>

                        <p className="text-sm opacity-80 text-center">
                            Create your team to start collaborating and planning together
                        </p>

                        <div className="flex items-center justify-center space-x-2 text-amber-200">
                            <Users size={24} />
                            <span className="text-lg font-medium">Better Together</span>
                        </div>
                    </div>
                    <p className="absolute bottom-6 text-xs text-stone-200 italic z-10">
                        Plan wisely. Execute flawlessly.
                    </p>
                </div>

                {/* Right section - team setup form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-white">
                    <Card className="w-full max-w-md bg-transparent border-none shadow-none">
                        <CardContent className="p-2 md:p-6">
                            <h2 className="text-2xl font-bold text-red-900 mb-2 text-center">
                                Create Your Team
                            </h2>

                            <p className="text-sm text-stone-500 text-center mb-6">
                                Give your team a name to get started with collaborative planning
                            </p>

                            <div className="space-y-6">
                                {/* Team Name field */}
                                <div className="relative">
                                    <Input
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        type="text"
                                        placeholder="Enter your team name"
                                        className="pl-10 pr-4 py-6 bg-stone-200 border-none rounded-md text-red-900 placeholder:text-stone-500"
                                        maxLength={50}
                                        required
                                    />
                                    <Users
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-900 w-5 h-5"
                                    />
                                </div>

                                {/* Character count */}
                                <div className="text-right">
                                    <span className="text-xs text-stone-400">
                                        {teamName.length}/50 characters
                                    </span>
                                </div>

                                {/* Create Team button */}
                                <Button
                                    onClick={onHandleCreateTeam}
                                    disabled={isLoading || !teamName.trim()}
                                    className="w-full py-6 bg-red-900 text-white font-semibold border-2 border-red-900 rounded-md hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <ButtonLoadingSpinner /> : "Create Team"}
                                </Button>

                                {/* Skip option */}
                                {onSkip && (
                                    <div className="text-center">
                                        <Button
                                            variant="ghost"
                                            onClick={handleSkip}
                                            className="text-stone-500 hover:text-red-900 text-sm underline-offset-4 hover:underline"
                                            disabled={isLoading}
                                        >
                                            Skip for now
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TeamSetup;