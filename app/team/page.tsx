import React from 'react'

const page = () => {
    const everything = [
        {
            domainName: "Faculty Mentor",
            members: [
                {
                    name: "Dr. Nikita Joshi",
                    role: "",
                    avatar: "/team/nikitamam.jpg"
                }
            ]
        },
        {
            domainName: "Leadership",
            members: [
                {
                    name: "Nirav Maheta",
                    role: "President",
                    avatar: "/team/nirav.jpg"
                },
                {
                    name: "Sahil Patel",
                    role: "Vice President",
                    avatar: "/team/sahil.jpg"
                }
            ]
        },
        {
            domainName: "WebDev",
            members: [
                {
                    name: "Harshil Upadhyay",
                    role: "Lead",
                    avatar: "/team/harshil.jpg"
                },
                {
                    name: "Rudra Patel",
                    role: "Member",
                    avatar: "/team/rudra.jpg"
                },
                {
                    name: "Dwij Gosai",
                    role: "Member",
                    avatar: "/team/dwij.jpg"
                },
                {
                    name: "Tirth Choksi",
                    role: "Member",
                    avatar: "/team/tirthc.jpg"
                },
                {
                    name: "Sharanya",
                    role: "Member",
                    avatar: "/team/saranya.jpg"
                }
            ]
        },
        {
            domainName: "DSA",
            members: [
                {
                    name: "Pratham Gavadia",
                    role: "Lead",
                    avatar: "/team/prathams.jpg"
                },
                {
                    name: "Pruthvi Navadiya",
                    role: "Member",
                    avatar: "/team/pruthvi.jpg"
                },
                {
                    name: "Harry Panchal",
                    role: "Member",
                    avatar: "/team/harry.jpg"
                },
                {
                    name: "Jhanvi Patel",
                    role: "Member",
                    avatar: "/team/jhanvi.jpg"
                },
                {
                    name: "Tirth Jain",
                    role: "Member",
                    avatar: "/team/tirthj.jpg"
                }
            ]
        },
        {
            domainName: "Machine Learning",
            members: [
                {
                    name: "Vrajesh Sharma",
                    role: "Lead",
                    avatar: "/team/vrajesh.jpg"
                },
                {
                    name: "Saurabh Singh",
                    role: "Member",
                    avatar: "/team/saurabh.jpg"
                },
                {
                    name: "Sharv Mehta",
                    role: "Member",
                    avatar: "/team/sharv.jpg"
                },
                {
                    name: "Samarth Shrivastava",
                    role: "Member",
                    avatar: "/team/samarth.jpg"
                },
                {
                    name: "Dhruval Patel",
                    role: "Member",
                    avatar: "/team/dhruval.jpg"
                }
            ]
        },
        {
            domainName: "Design",
            members: [
                {
                    name: "Yaksh Vadaliya",
                    role: "Lead",
                    avatar: "/team/yaksh2.jpg"
                },
                {
                    name: "Ved Parmar",
                    role: "Assistant",
                    avatar: "/team/ved.jpg"
                }
            ]
        },
        {
            domainName: "Public Relations",
            members: [
                {
                    name: "Deep Adatiya",
                    role: "Lead",
                    avatar: "/team/deep.jpg"
                },
                {
                    name: "Malhar Patel",
                    role: "Member",
                    avatar: "/team/malhar.jpg"
                },
                {
                    name: "Darshi Prajapati",
                    role: "Member",
                    avatar: "/team/darshi.jpg"
                },
                {
                    name: "Avyay Kachhia",
                    role: "Member",
                    avatar: "/team/avyay.jpg"
                },
                {
                    name: "Heer Rana",
                    role: "Member",
                    avatar: "/team/heer.jpg"
                }
            ]
        },
        {
            domainName: "Social Media",
            members: [
                {
                    name: "Pratham Patel",
                    role: "Lead",
                    avatar: "/team/prathama.jpg"
                }
            ]
        }
    ]

    return (
        <section className="py-12 md:py-32">
            <div className="mx-auto max-w-3xl px-8 lg:px-0">
                <h2 className="mb-8 text-primary uppercase text-4xl font-bold md:mb-16 lg:text-5xl">The Faces Behind ASPDC</h2>
                {
                    everything.map((d, idx) => (
                        <div key={idx}>
                            <h3 className="mb-6 text-lg font-medium">{d.domainName}</h3>
                            <div className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                                {d.members.map((member, index) => (
                                    <div key={index}>
                                        <div className="bg-background size-40 rounded-xl border p-0.5 shadow shadow-zinc-950/5">
                                            <img className="aspect-square rounded-xl object-cover" src={member.avatar} alt={member.name} height="460" width="460" loading="lazy" />
                                        </div>
                                        <span className="mt-2 block text-sm">{member.name}</span>
                                        <span className="text-muted-foreground block text-xs">{member.role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))

                }
            </div>
        </section>
    )
}

export default page